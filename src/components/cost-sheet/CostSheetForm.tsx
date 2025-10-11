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
import { useCreateCostSheetMutation } from "@/redux/api/costSheetApi";

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
  qty: string;
  cadConsumption: any; // changed from any[] to any
  fabricCost: any;
  trimsAccessories: any; // changed from any[] to any
  summary: any;
  others: any; // changed from any[] to any
}

const CostSheetForm = ({ onClose }: CostSheetFormProps) => {
  const [styleExists, setStyleExists] = useState<boolean | null>(null);
  const [creatorName, setCreatorName] = useState("");
  const [showSections, setShowSections] = useState(false);
  const [isCheckingStyle, setIsCheckingStyle] = useState(false);
  const [createCostSheet, { isLoading: isSaving }] = useCreateCostSheetMutation();

  // Unified state for each section
  const [cadData, setCadDataRaw] = useState<{ rows: any[]; json: any }>({ rows: [], json: {} });
  const [fabricData, setFabricDataRaw] = useState<{ rows?: any[]; json?: any }>({ rows: [], json: {} });
  const [trimsData, setTrimsDataRaw] = useState<{ rows: any[]; json: any }>({ rows: [], json: {} });
  const [othersData, setOthersDataRaw] = useState<{ rows: any[]; json?: any }>({ rows: [], json: {} });
  const [summaryData, setSummaryData] = useState<{ summary: any; json: any }>({ summary: {}, json: {} });

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

  const handleStyleCheck = async (style: string) => {
    if (!style.trim()) return;

    setIsCheckingStyle(true);
    try {
      // Simulated API call - replace with actual endpoint
      const response = await fetch(`/api/cost-sheets/check-style?style=${style}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.exists) {
          setStyleExists(true);
          setCreatorName(data.creatorName);
          setShowSections(false);
        } else {
          setStyleExists(false);
          setShowSections(true);
        }
      } else {
        // For demo purposes, assume style doesn't exist
        setStyleExists(false);
        setShowSections(true);
      }
    } catch (error) {
      console.error("Error checking style:", error);
      // For demo purposes, assume style doesn't exist
      setStyleExists(false);
      setShowSections(true);
    } finally {
      setIsCheckingStyle(false);
    }
  };

  const handleSave = async () => {
    const formData = form.getValues();

    // Ensure fallback for missing sections
    const costSheetData: CostSheetData = {
      ...formData,
      cadConsumption: cadData.json ?? {},
      fabricCost: fabricData.json ?? {},
      trimsAccessories: trimsData.json ?? {},
      summary: summaryData.json ?? {},
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

  const calculateSummary = () => {
    // Use totalFabricCost from fabricData.json
    const fabricCost = fabricData.json?.totalFabricCost || 0;
    // Use trimsData.rows for reduce
    const accessoriesCost = trimsData.rows.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
    const factoryCM = 14.0;
    const totalCost = fabricCost + accessoriesCost + factoryCM;
    const profitPercentage = 0.15;
    const commercialProfit = totalCost * profitPercentage;
    const fobPrice = totalCost + commercialProfit;
    const pricePerPiece = fobPrice / 12;

    return {
      fabricCost,
      accessoriesCost,
      factoryCM,
      totalCost,
      commercialProfit,
      fobPrice,
      pricePerPiece,
      profitPercentage,
    };
  };

  // Helper setters to extract both rows and json
  const setCadData = (data: any) => setCadDataRaw(data || { rows: [], json: {} });
  const setTrimsData = (data: any) => setTrimsDataRaw(data || { rows: [], json: {} });
  const setOthersData = (data: any) => setOthersDataRaw(data || { rows: [], json: {} });
  const setFabricData = (data: any) => setFabricDataRaw(data || { rows: [], json: {} });
  const handleSummaryChange = (data: any) => setSummaryData(data || { summary: {}, json: {} });

  return (
    <div className="space-y-6">
      <StyleInfoForm
        form={form}
        onStyleCheck={handleStyleCheck}
        isCheckingStyle={isCheckingStyle}
        styleExists={styleExists}
        creatorName={creatorName}
      />

      {showSections && (
        <div className="space-y-4">
          {/* <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">CAD Consumption</Button>
            <Button variant="outline" size="sm">Fabric Cost</Button>
            <Button variant="outline" size="sm">Trims & Accessories</Button>
            <Button variant="outline" size="sm">Summary</Button>
            <Button variant="outline" size="sm">Others</Button>
          </div> */}

          <div className="space-y-6">
            <CadConsumptionSection data={cadData.rows} onChange={setCadData} />
            <FabricCostSection data={fabricData.rows || []} onChange={setFabricData} />
            <TrimsAccessoriesSection data={trimsData.rows} onChange={setTrimsData} />
            <OthersSection data={othersData.rows} onChange={setOthersData} />
            <SummarySection
              summary={summaryData.summary}
              fabricData={fabricData.json || {}}
              trimsData={trimsData.rows}
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
