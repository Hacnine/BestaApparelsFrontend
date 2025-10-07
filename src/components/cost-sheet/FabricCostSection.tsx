import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FabricRow {
  id: string;
  description: string;
  unit: number;
  rate: number;
  value: number;
}

interface FabricCostSectionProps {
  data: any;
  onChange: (data: any) => void;
}

const FabricCostSection = ({ data, onChange }: FabricCostSectionProps) => {
  const [yarnRows, setYarnRows] = useState<FabricRow[]>([
    { id: "yarn-1", description: "30/1, 100% Cotton", unit: 0, rate: 2.7, value: 0 },
    { id: "yarn-2", description: "20/1, 100% Cotton", unit: 0, rate: 2.7, value: 0 },
  ]);

  const [knittingRows, setKnittingRows] = useState<FabricRow[]>([
    { id: "knit-1", description: "F. Terry", unit: 0, rate: 0.3, value: 0 },
    { id: "knit-2", description: "Rib", unit: 0, rate: 0.35, value: 0 },
    { id: "knit-3", description: "SJ", unit: 0, rate: 0.15, value: 0 },
  ]);

  const [dyeingRows, setDyeingRows] = useState<FabricRow[]>([
    { id: "dye-1", description: "Avarage Color shade", unit: 0, rate: 1.0, value: 0 },
    { id: "dye-2", description: "Peach", unit: 0, rate: 0.53, value: 0 },
    { id: "dye-3", description: "Brush", unit: 0, rate: 0.4, value: 0 },
    { id: "dye-4", description: "Peach & Brush", unit: 0, rate: 0.67, value: 0 },
    { id: "dye-5", description: "Heat set", unit: 0, rate: 0.25, value: 0 },
  ]);

  const [printEmbRows, setPrintEmbRows] = useState<FabricRow[]>([
    { id: "print-1", description: "AOP", unit: 0, rate: 1.6, value: 0 },
    { id: "print-2", description: "Screen print", unit: 0, rate: 0, value: 0 },
    { id: "print-3", description: "Emb (Chest + Back)", unit: 0, rate: 0, value: 0 },
    { id: "print-4", description: "Wash", unit: 0, rate: 0, value: 0 },
  ]);

  const updateRows = (rows: FabricRow[], setRows: any, id: string, field: keyof FabricRow, value: any) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        if (field === "unit" || field === "rate") {
          updatedRow.value = parseFloat(updatedRow.unit as any) * parseFloat(updatedRow.rate as any) || 0;
        }
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
    updateTotalData();
  };

  const addRow = (rows: FabricRow[], setRows: any, prefix: string) => {
    const newRow: FabricRow = {
      id: `${prefix}-${Date.now()}`,
      description: "New Item",
      unit: 0,
      rate: 0,
      value: 0,
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (rows: FabricRow[], setRows: any, id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const calculateTotal = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (parseFloat(row.value as any) || 0), 0);
  };

  const updateTotalData = () => {
    const yarnTotal = calculateTotal(yarnRows);
    const knittingTotal = calculateTotal(knittingRows);
    const dyeingTotal = calculateTotal(dyeingRows);
    const printEmbTotal = calculateTotal(printEmbRows);
    const totalCost = yarnTotal + knittingTotal + dyeingTotal + printEmbTotal;

    onChange({
      yarnRows,
      knittingRows,
      dyeingRows,
      printEmbRows,
      yarnTotal,
      knittingTotal,
      dyeingTotal,
      printEmbTotal,
      totalCost,
    });
  };

  useEffect(() => {
    updateTotalData();
  }, [yarnRows, knittingRows, dyeingRows, printEmbRows]);

  const renderSubsection = (
    title: string,
    rows: FabricRow[],
    setRows: any,
    prefix: string
  ) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left p-2 text-sm font-medium">Description</th>
              <th className="text-right p-2 text-sm font-medium">Unit</th>
              <th className="text-right p-2 text-sm font-medium">Rate ($)</th>
              <th className="text-right p-2 text-sm font-medium">Value ($)</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/20">
                <td className="p-2">
                  <Input
                    value={row.description}
                    onChange={(e) => updateRows(rows, setRows, row.id, "description", e.target.value)}
                    className="h-8 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={row.unit}
                    onChange={(e) => updateRows(rows, setRows, row.id, "unit", e.target.value)}
                    className="h-8 text-right text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={row.rate}
                    onChange={(e) => updateRows(rows, setRows, row.id, "rate", e.target.value)}
                    className="h-8 text-right text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={row.value.toFixed(2)}
                    readOnly
                    className="h-8 text-right bg-muted/50 text-sm"
                  />
                </td>
                <td className="p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => deleteRow(rows, setRows, row.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={() => addRow(rows, setRows, prefix)} variant="outline" size="sm">
        <Plus className="h-3 w-3 mr-1" />
        Add Field
      </Button>
    </div>
  );

  const totalFabricCost = calculateTotal(yarnRows) + calculateTotal(knittingRows) + 
                          calculateTotal(dyeingRows) + calculateTotal(printEmbRows);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fabric Cost</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderSubsection("Yarn Price", yarnRows, setYarnRows, "yarn")}
        <Separator />
        {renderSubsection("Knitting", knittingRows, setKnittingRows, "knit")}
        <Separator />
        {renderSubsection("Dyeing", dyeingRows, setDyeingRows, "dye")}
        <Separator />
        {renderSubsection("Print & EMB", printEmbRows, setPrintEmbRows, "print")}
        
        <div className="pt-4 border-t-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total Fabric Cost (USD / Dozen Garments)</span>
            <span className="text-primary">${totalFabricCost.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FabricCostSection;
