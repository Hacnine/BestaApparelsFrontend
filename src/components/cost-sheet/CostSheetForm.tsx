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

  const [cadData, setCadData] = useState<any[]>([]);
  const [fabricData, setFabricData] = useState<any>({});
  const [trimsData, setTrimsData] = useState<any[]>([]);
  const [othersData, setOthersData] = useState<any[]>([]);

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

    // Prepare CAD Consumption section
    const cadConsumption = {
      tableName: "CAD Consumption / Dz",
      columns: ["Field Name", "Weight (kg)", "With %", "Fabric Consumption"],
      rows: cadData.map(row => ({
        fieldName: row.fieldName,
        weight: row.weight,
        percent: row.percent,
        value: row.value,
      })),
      totalWeight: cadData.reduce((sum, row) => sum + (Number(row.weight) || 0), 0),
      totalValue: cadData.reduce((sum, row) => sum + (row.value || 0), 0),
    };

    // Prepare Fabric Cost section
    const fabricCost = {
      tableName: "Fabric Cost",
      columns: ["Type", "Field Name", "Unit", "Rate ($)", "Value ($)"],
      yarnRows: (fabricData.yarnRows || []).map(row => ({
        type: "yarn",
        fieldName: row.fieldName,
        unit: row.unit,
        rate: row.rate,
        value: row.value,
      })),
      knittingRows: (fabricData.knittingRows || []).map(row => ({
        type: "knitting",
        fieldName: row.fieldName,
        unit: row.unit,
        rate: row.rate,
        value: row.value,
      })),
      dyeingRows: (fabricData.dyeingRows || []).map(row => ({
        type: "dyeing",
        fieldName: row.fieldName,
        unit: row.unit,
        rate: row.rate,
        value: row.value,
      })),
      printEmbRows: (fabricData.printEmbRows || []).map(row => ({
        type: "printEmb",
        fieldName: row.fieldName,
        unit: row.unit,
        rate: row.rate,
        value: row.value,
      })),
      totals: {
        yarnTotal: fabricData.yarnTotal || 0,
        knittingTotal: fabricData.knittingTotal || 0,
        dyeingTotal: fabricData.dyeingTotal || 0,
        printEmbTotal: fabricData.printEmbTotal || 0,
        totalCost: fabricData.totalCost || 0,
      }
    };

    // Prepare Trims & Accessories section
    const trimsAccessories = {
      tableName: "Trims & Accessories",
      columns: ["Description", "Cost"],
      rows: trimsData.map(row => ({
        description: row.description,
        cost: row.cost,
      })),
      subtotal: trimsData.reduce((sum, row) => sum + (Number(row.cost) || 0), 0),
      adjustmentPercent: 8,
      adjustment: trimsData.reduce((sum, row) => sum + (Number(row.cost) || 0), 0) * 0.08,
      totalAccessoriesCost: trimsData.reduce((sum, row) => sum + (Number(row.cost) || 0), 0) * 1.08,
    };

    // Prepare Others section
    const others = {
      tableName: "Others",
      columns: ["Label", "Value"],
      rows: othersData.map(row => ({
        label: row.label,
        value: row.value,
      })),
      total: othersData.reduce((sum, row) => sum + (Number(row.value) || 0), 0),
    };

    // Prepare Summary section
    const summary = calculateSummary();

    // Final payload
    const costSheetData: CostSheetData = {
      ...formData,
      cadConsumption,
      fabricCost,
      trimsAccessories,
      summary,
      others,
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
    const fabricCost = fabricData.totalCost || 0;
    const accessoriesCost = trimsData.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
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
            <CadConsumptionSection data={cadData} onChange={setCadData} />
            <FabricCostSection data={fabricData} onChange={setFabricData} />
            <TrimsAccessoriesSection data={trimsData} onChange={setTrimsData} />
            <SummarySection 
              summary={calculateSummary()}
              fabricData={fabricData}
              trimsData={trimsData}
            />
            <OthersSection data={othersData} onChange={setOthersData} />
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
