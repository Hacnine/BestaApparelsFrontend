import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import StyleInfoForm from "./StyleInfoForm";
import CadConsumptionSection from "./CadConsumptionSection";
import FabricCostSection from "./FabricCostSection";
import TrimsAccessoriesSection from "./TrimsAccessoriesSection";
import SummarySection from "./SummarySection";
import OthersSection from "./OthersSection";
import {
  useCreateCostSheetMutation,
  useCheckStyleQuery,
} from "@/redux/api/costSheetApi";

interface CostSheetFormProps {
  onClose: () => void;
}

export interface CostSheetData {
  style: string;
  item: string;
  group: string;
  size: string;
  fabricType: string;
  gsm: string;
  color: string;
  qty: string; // will be sent as quantity (Int) to backend
  cadConsumption: any;
  fabricCost: any;
  trimsAccessories: any;
  summary: any;
  others: any;
}

const CostSheetForm = ({ onClose }: CostSheetFormProps) => {
  const [createCostSheet, { isLoading: isSaving }] =
    useCreateCostSheetMutation();

  // Unified state for each section
  const [cadData, setCadDataRaw] = useState<{ rows: any[]; json: any }>({
    rows: [],
    json: {},
  });
  const [fabricData, setFabricDataRaw] = useState<{ rows?: any[]; json?: any }>(
    { rows: [], json: {} }
  );
  const [trimsData, setTrimsDataRaw] = useState<{ rows: any[]; json: any }>({
    rows: [],
    json: {},
  });
  const [othersData, setOthersDataRaw] = useState<{ rows: any[]; json?: any }>({
    rows: [],
    json: {},
  });
  const [summaryData, setSummaryData] = useState<{ summary: any; json: any }>({
    summary: {},
    json: {},
  });

  const form = useForm<CostSheetData>({
    defaultValues: {
      style: "",
      item: "",
      group: "",
      size: "",
      fabricType: "",
      gsm: "",
      color: "",
      qty: "",
    },
  });

  // Watch style field and check style existence
  const styleValue = form.watch("style");
  const stylePattern = /^[A-Za-z0-9-]+$/;
  const { data: styleCheckData, isFetching: isStyleChecking } =
    useCheckStyleQuery(styleValue, {
      skip: !styleValue || !stylePattern.test(styleValue),
      refetchOnMountOrArgChange: true,
    });

  const calculateSummary = () => {
    // Use totalFabricCost from fabricData.json
    const fabricCost = fabricData.json?.totalFabricCost || 0;
    // Use correct accessories cost from trimsData.json
    const accessoriesCost =
      trimsData.json?.totalAccessoriesCost !== undefined
        ? Number(trimsData.json.totalAccessoriesCost)
        : trimsData.rows.reduce(
            (sum, item) => sum + (parseFloat(item.cost) || 0),
            0
          );
    // Use Others cost from othersData.json
    const othersCost =
      othersData.json?.total !== undefined ? Number(othersData.json.total) : 0;

    const factoryCM = 14.0;
    const totalCost = fabricCost + accessoriesCost + factoryCM + othersCost;
    const profitPercentage = 0.15;
    const commercialProfit = totalCost * profitPercentage;
    const fobPrice = totalCost + commercialProfit;
    const pricePerPiece = fobPrice / 12;

    return {
      fabricCost,
      accessoriesCost,
      factoryCM,
      othersCost,
      totalCost,
      commercialProfit,
      fobPrice,
      pricePerPiece,
      profitPercentage,
    };
  };

  const calculatedSummary = calculateSummary();
  console.log(calculatedSummary.othersCost);

  const handleSave = async () => {
    const formData = form.getValues();

    // Use summary data from SummarySection if available, otherwise calculate
    let summaryJsonToSend;
    
    if (summaryData.json && Object.keys(summaryData.json).length > 0) {
      // Use data from SummarySection component
      summaryJsonToSend = summaryData.json;
    } else {
      // Fallback to calculated summary
      const calculatedSummary = calculateSummary();
      summaryJsonToSend = {
        tableName: "Summary",
        fabricCost: calculatedSummary.fabricCost,
        accessoriesCost: calculatedSummary.accessoriesCost,
        factoryCM: calculatedSummary.factoryCM,
        othersTotal: calculatedSummary.othersCost,
        totalCost: calculatedSummary.totalCost,
        commercialPercent: 15,
        commercialCost: calculatedSummary.fabricCost + calculatedSummary.accessoriesCost + calculatedSummary.factoryCM + calculatedSummary.othersCost * 0.15,
        profitPercent: 0,
        profitCost: 0,
        fobPrice: calculatedSummary.fobPrice,
        pricePerPiece: calculatedSummary.pricePerPiece,
      };
    }

    // Ensure fallback for missing sections
    const costSheetData: CostSheetData = {
      style: formData.style,
      item: formData.item,
      group: formData.group,
      size: formData.size,
      fabricType: formData.fabricType,
      gsm: formData.gsm,
      color: formData.color,
      qty: formData.qty || "0",
      cadConsumption: cadData.json ?? {},
      fabricCost: fabricData.json ?? {},
      trimsAccessories: trimsData.json ?? {},
      summary: summaryJsonToSend,
      others: othersData.json ?? {},
    };

    try {
      await createCostSheet(costSheetData).unwrap();
      toast.success("Cost Sheet saved successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save Cost Sheet");
    }
  };
  // Helper setters to extract both rows and json
  const setCadData = (data: any) =>
    setCadDataRaw(data || { rows: [], json: {} });
  const setTrimsData = (data: any) =>
    setTrimsDataRaw(data || { rows: [], json: {} });
  const setOthersData = (data: any) =>
    setOthersDataRaw(data || { rows: [], json: {} });
  const setFabricData = (data: any) =>
    setFabricDataRaw(data || { rows: [], json: {} });
  const handleSummaryChange = (data: any) =>
    setSummaryData(data || { summary: {}, json: {} });

  return (
    <div className="space-y-6">
      <StyleInfoForm
        form={form}
        mode="create"
        onStyleCheck={() => {}}
        isCheckingStyle={isStyleChecking}
        styleExists={styleCheckData?.exists ?? null}
        creatorName={styleCheckData?.creatorName ?? ""}
      />

      {/* Show sections only if style is available */}
      {styleCheckData?.exists === false && (
        <div className="space-y-4">
          <div className="space-y-6">
            <CadConsumptionSection data={cadData.rows} onChange={setCadData} />
            <FabricCostSection
              data={fabricData}
              onChange={setFabricData}
            />
            <TrimsAccessoriesSection
              data={trimsData.rows}
              onChange={setTrimsData}
            />
            <OthersSection data={othersData.rows} onChange={setOthersData} />
            <SummarySection
              summary={summaryData.summary}
              fabricData={fabricData.json || {}}
              trimsData={trimsData.rows}
              othersData={othersData.json}
              onChange={handleSummaryChange}
            />
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              Save Cost Sheet
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostSheetForm;
