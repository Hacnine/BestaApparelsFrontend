import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SummarySectionProps {
  summary: any;
  fabricData: any;
  trimsData: any[];
}

const SummarySection = ({ summary, fabricData, trimsData }: SummarySectionProps) => {
  const [factoryCM, setFactoryCM] = useState(14.0);
  const [profitPercent, setProfitPercent] = useState(15);

  const fabricCost = fabricData.totalCost || 0;
  const trimsSubtotal = trimsData.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const trimsAdjustment = trimsSubtotal * 0.08;
  const accessoriesCost = trimsSubtotal + trimsAdjustment;
  
  const totalCost = fabricCost + accessoriesCost + factoryCM;
  const commercialProfit = totalCost * (profitPercent / 100);
  const fobPrice = totalCost + commercialProfit;
  const pricePerPiece = fobPrice / 12;

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
                onChange={(e) => setFactoryCM(Number(e.target.value) || 0)}
                className="font-semibold"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profitPercent">Commercial & Profit %</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="profitPercent"
                  type="string"
                  value={profitPercent}
                  onChange={(e) => setProfitPercent(Number(e.target.value) || 0)}
                  className="font-semibold"
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
