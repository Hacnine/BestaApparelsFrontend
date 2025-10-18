import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SummarySectionChange {
  summary: any;
  json: any;
}

interface SummarySectionEditProps {
  summary: any;
  fabricData: any;
  trimsData: any[];
  othersData: any;
  onChange?: (data: SummarySectionChange) => void;
}

const SummarySectionEdit = ({
  summary = {},
  fabricData,
  trimsData,
  othersData,
  onChange,
}: SummarySectionEditProps) => {
  // Initialize with existing data or defaults
  const [factoryCM, setFactoryCM] = useState(14.0);
  const [profitPercent, setProfitPercent] = useState(0);
  const [commercialPercent, setCommercialPercent] = useState(15);

  // Initialize values from summary prop when available
  useEffect(() => {
    if (summary) {
      // Handle both direct summary object and json-wrapped structure
      const summaryData = summary.json || summary;

      if (summaryData.factoryCM !== undefined) setFactoryCM(Number(summaryData.factoryCM));
      if (summaryData.profitPercent !== undefined) setProfitPercent(Number(summaryData.profitPercent));
      if (summaryData.commercialPercent !== undefined) setCommercialPercent(Number(summaryData.commercialPercent));
    }
  }, [summary]);

  // Calculate fabric cost
  const getFabricCost = () => {
    if (fabricData?.totalFabricCost !== undefined) {
      return fabricData.totalFabricCost;
    }
    if (fabricData?.json?.totalFabricCost !== undefined) {
      return fabricData.json.totalFabricCost;
    }
    let total = 0;
    if (fabricData?.yarnRows && Array.isArray(fabricData.yarnRows)) {
      total += fabricData.yarnRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    if (fabricData?.knittingRows && Array.isArray(fabricData.knittingRows)) {
      total += fabricData.knittingRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    if (fabricData?.dyeingRows && Array.isArray(fabricData.dyeingRows)) {
      total += fabricData.dyeingRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    return total;
  };
  const fabricCost = getFabricCost();

  // Calculate accessories cost
  const accessoriesCost =
    typeof trimsData?.subtotal === "number"
      ? trimsData.subtotal
      : typeof trimsData?.totalAccessoriesCost === "number"
      ? trimsData.totalAccessoriesCost
      : Array.isArray(trimsData)
      ? trimsData.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
      : 0;

  // Dynamically calculate total for 'othersData' if it's an array
  let othersTotal = 0;
  if (Array.isArray(othersData)) {
    othersTotal = othersData.reduce((sum, item) => {
      const val = parseFloat(item.value);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  } else if (typeof othersData?.total === "number") {
    othersTotal = othersData.total;
  } else if (typeof othersData?.json?.total === "number") {
    othersTotal = othersData.json.total;
  }

  const totalCost = fabricCost + accessoriesCost + factoryCM + othersTotal;
  const commercialCost = totalCost * (commercialPercent / 100);
  // Add commercialCost to totalCost for display
  const totalCostWithCommercial = totalCost + commercialCost;
  const profitCost = totalCostWithCommercial * (profitPercent / 100);
  const fobPrice = totalCostWithCommercial + profitCost;
  const pricePerPiece = fobPrice / 12;

  // Helper to send summary data to parent
  const notifyChange = (nextFactoryCM: number, nextProfitPercent: number, nextCommercialPercent: number) => {
    if (onChange) {
      const nextTotalCost = fabricCost + accessoriesCost + nextFactoryCM + othersTotal;
      const nextCommercialCost = nextTotalCost * (nextCommercialPercent / 100);
      const nextProfitCost = nextTotalCost * (nextProfitPercent / 100);
      const nextFobPrice = nextTotalCost + nextCommercialCost + nextProfitCost;
      const nextPricePerPiece = nextFobPrice / 12;

      onChange({
        summary: {
          factoryCM: nextFactoryCM,
          commercialPercent: nextCommercialPercent,
          profitPercent: nextProfitPercent,
        },
        json: {
          tableName: "Summary",
          factoryCM: nextFactoryCM,
          commercialPercent: nextCommercialPercent,
          profitPercent: nextProfitPercent,
        }
      });
    }
  };

  // Only call notifyChange when user changes factoryCM or profitPercent
  const handleFactoryCMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    setFactoryCM(value);
    notifyChange(value, profitPercent, commercialPercent);
  };

  const handleProfitPercentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value) || 0;
    setProfitPercent(value);
    notifyChange(factoryCM, value, commercialPercent);
  };

  const handleCommercialPercentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value) || 0;
    setCommercialPercent(value);
    notifyChange(factoryCM, profitPercent, value);
  };

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b">
            <div className="space-y-2">
              <Label htmlFor="factoryCM">Factory CM / Dzn Garments</Label>
              <Input
                id="factoryCM"
                type="string"
                value={factoryCM}
                onChange={handleFactoryCMChange}
                className="font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercialPercent">Commercial %</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="commercialPercent"
                  type="string"
                  value={commercialPercent}
                  onChange={handleCommercialPercentChange}
                  className="font-semibold"
                />
                 <span className="font-semibold">
                $
                {Number(commercialCost)
                  ? Number(commercialCost).toFixed(3)
                  : "0.000"}
              </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profitPercent">Profit %</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="profitPercent"
                  type="string"
                  value={profitPercent}
                  onChange={handleProfitPercentChange}
                  className="font-semibold"
                />
                 <span className="font-semibold">
                $
                {Number(profitCost)
                  ? Number(profitCost).toFixed(3)
                  : "0.000"}
              </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Fabric Cost / Dzn Garments</span>
              <span className="font-semibold">
                $
                {Number(fabricCost) ? Number(fabricCost).toFixed(3) : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">
                Accessories Cost / Dzn Garments
              </span>
              <span className="font-semibold">
                $
                {Number(accessoriesCost)
                  ? Number(accessoriesCost).toFixed(3)
                  : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Factory CM / Dzn Garments</span>
              <span className="font-semibold">
                ${Number(factoryCM) ? Number(factoryCM).toFixed(3) : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">Others Cost</span>
              <span className="font-semibold">
                  $
                  {Number(othersTotal)
                    ? Number(othersTotal).toFixed(3)
                    : "0.000"}
              </span>
            </div>

              <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                <span className="font-medium">
                  Commercial Cost ({commercialPercent}%)
                </span>
                <span className="font-semibold">
                  $
                  {Number(commercialCost)
                    ? Number(commercialCost).toFixed(3)
                    : "0.000"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-primary/10 rounded border border-primary/20">
                <span className="font-bold">Total Cost (with Commercial)</span>
                <span className="font-bold text-lg">
                  ${Number(totalCostWithCommercial) ? Number(totalCostWithCommercial).toFixed(3) : "0.000"}
                </span>
              </div>

            <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
              <span className="font-medium">
                Profit ({profitPercent}%)
              </span>
              <span className="font-semibold">
                $
                {Number(profitCost)
                  ? Number(profitCost).toFixed(3)
                  : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-accent/10 rounded border border-accent/20">
              <span className="font-bold text-lg">FOB Price / Dzn</span>
              <span className="font-bold text-xl text-accent">
                ${Number(fobPrice) ? Number(fobPrice).toFixed(3) : "0.000"}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/20 rounded-lg border-2 border-primary">
              <span className="font-bold text-lg">Price / Pc Garments</span>
              <span className="font-bold text-2xl text-primary">
                $
                {Number(pricePerPiece)
                  ? Number(pricePerPiece).toFixed(3)
                  : "0.000"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySectionEdit;