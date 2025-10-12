import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SummarySectionChange {
  summary: any;
  json: any;
}

interface SummarySectionProps {
  summary: any;
  fabricData: any;
  trimsData: any[];
  onChange?: (data: SummarySectionChange) => void;
  mode?: "create" | "edit" | "show";
}

const SummarySection = ({
  summary,
  fabricData,
  trimsData,
  onChange,
  mode = "create",
}: SummarySectionProps) => {
  // If in show mode, use summary directly, otherwise use state
  const [factoryCM, setFactoryCM] = useState(
    typeof summary?.factoryCM === "number" ? summary.factoryCM : 14.0
  );
  const [profitPercent, setProfitPercent] = useState(
    typeof summary?.profitPercent === "number" ? summary.profitPercent : 15
  );
  const [editMode, setEditMode] = useState(mode === "edit" || mode === "create");

  // Use summary fields if in show mode, otherwise calculate
  const fabricCost =
    typeof summary?.fabricCost === "number"
      ? summary.fabricCost
      : fabricData.totalCost || 0;
  const accessoriesCost =
    typeof summary?.accessoriesCost === "number"
      ? summary.accessoriesCost
      : (() => {
          const trimsSubtotal = trimsData.reduce(
            (sum, item) => sum + (Number(item.cost) || 0),
            0
          );
          const trimsAdjustment = trimsSubtotal * 0.08;
          return trimsSubtotal + trimsAdjustment;
        })();
  const totalCost =
    typeof summary?.totalCost === "number"
      ? summary.totalCost
      : fabricCost + accessoriesCost + factoryCM;
  const commercialProfit =
    typeof summary?.commercialProfit === "number"
      ? summary.commercialProfit
      : totalCost * (profitPercent / 100);
  const fobPrice =
    typeof summary?.fobPrice === "number"
      ? summary.fobPrice
      : totalCost + commercialProfit;
  const pricePerPiece =
    typeof summary?.pricePerPiece === "number"
      ? summary.pricePerPiece
      : fobPrice / 12;

  // Helper to send summary data to parent
  const notifyChange = (nextFactoryCM: number, nextProfitPercent: number) => {
    if (onChange) {
      const nextTotalCost = fabricCost + accessoriesCost + nextFactoryCM;
      const nextCommercialProfit = nextTotalCost * (nextProfitPercent / 100);
      const nextFobPrice = nextTotalCost + nextCommercialProfit;
      const nextPricePerPiece = nextFobPrice / 12;
      onChange({
        summary: {
          fabricCost,
          accessoriesCost,
          factoryCM: nextFactoryCM,
          totalCost: nextTotalCost,
          commercialProfit: nextCommercialProfit,
          fobPrice: nextFobPrice,
          pricePerPiece: nextPricePerPiece,
          profitPercent: nextProfitPercent,
        },
        json: {
          tableName: "Summary",
          fields: [
            { label: "Fabric Cost / Dzn Garments", value: fabricCost },
            { label: "Accessories Cost / Dzn Garments", value: accessoriesCost },
            { label: "Factory CM / Dzn Garments", value: nextFactoryCM },
            { label: "Total Cost", value: nextTotalCost },
            { label: `Commercial & Profit Cost (${nextProfitPercent}%)`, value: nextCommercialProfit },
            { label: "FOB Price / Dzn", value: nextFobPrice },
            { label: "Price / Pc Garments", value: nextPricePerPiece },
          ],
        }
      });
    }
  };

  // Only call notifyChange when user changes factoryCM or profitPercent
  const handleFactoryCMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setFactoryCM(value);
    notifyChange(value, profitPercent);
  };

  const handleProfitPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setProfitPercent(value);
    notifyChange(factoryCM, value);
  };

  const isEditable = editMode && (mode === "edit" || mode === "create");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div className="space-y-2">
              <Label htmlFor="factoryCM">Factory CM / Dzn Garments</Label>
              <Input
                id="factoryCM"
                type="string"
                value={factoryCM}
                onChange={handleFactoryCMChange}
                className="font-semibold"
                readOnly={!isEditable}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profitPercent">Commercial & Profit %</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="profitPercent"
                  type="string"
                  value={profitPercent}
                  onChange={handleProfitPercentChange}
                  className="font-semibold"
                  readOnly={!isEditable}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Fabric Cost / Dzn Garments</span>
              <span className="font-semibold">
                ${Number(fabricCost) ? Number(fabricCost).toFixed(2) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Accessories Cost / Dzn Garments</span>
              <span className="font-semibold">
                ${Number(accessoriesCost) ? Number(accessoriesCost).toFixed(2) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Factory CM / Dzn Garments</span>
              <span className="font-semibold">
                ${Number(factoryCM) ? Number(factoryCM).toFixed(2) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
              <span className="font-bold">Total Cost</span>
              <span className="font-bold text-lg">
                ${Number(totalCost) ? Number(totalCost).toFixed(2) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Commercial & Profit Cost ({profitPercent}%)</span>
              <span className="font-semibold">
                ${Number(commercialProfit) ? Number(commercialProfit).toFixed(2) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-accent/10 rounded border border-accent/20">
              <span className="font-bold text-lg">FOB Price / Dzn</span>
              <span className="font-bold text-xl text-accent">
                ${Number(fobPrice) ? Number(fobPrice).toFixed(2) : "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/20 rounded-lg border-2 border-primary">
              <span className="font-bold text-lg">Price / Pc Garments</span>
              <span className="font-bold text-2xl text-primary">
                ${Number(pricePerPiece) ? Number(pricePerPiece).toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
