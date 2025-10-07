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
  cadConsumption: any[];
  fabricCost: any;
  trimsAccessories: any[];
  summary: any;
  others: any[];
}

const CostSheetForm = ({ onClose }: CostSheetFormProps) => {
  const [styleExists, setStyleExists] = useState<boolean | null>(null);
  const [creatorName, setCreatorName] = useState("");
  const [showSections, setShowSections] = useState(false);
  const [isCheckingStyle, setIsCheckingStyle] = useState(false);

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
    
    const costSheetData: CostSheetData = {
      ...formData,
      cadConsumption: cadData,
      fabricCost: fabricData,
      trimsAccessories: trimsData,
      summary: calculateSummary(),
      others: othersData,
    };

    try {
      const response = await fetch("/api/cost-sheets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(costSheetData),
      });

      if (response.ok) {
        toast.success("Cost Sheet saved successfully!");
        onClose();
      } else {
        toast.error("Failed to save Cost Sheet");
      }
    } catch (error) {
      console.error("Error saving cost sheet:", error);
      toast.error("Error saving Cost Sheet");
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
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">CAD Consumption</Button>
            <Button variant="outline" size="sm">Fabric Cost</Button>
            <Button variant="outline" size="sm">Trims & Accessories</Button>
            <Button variant="outline" size="sm">Summary</Button>
            <Button variant="outline" size="sm">Others</Button>
          </div>

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
            <Button onClick={handleSave}>
              Save Cost Sheet
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostSheetForm;
