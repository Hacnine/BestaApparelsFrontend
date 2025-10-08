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
    { id: "yarn-1", description: "30/1, 100% Cotton", unit: undefined, rate: 2.7, value: undefined },
    { id: "yarn-2", description: "20/1, 100% Cotton", unit: undefined, rate: 2.7, value: undefined },
  ]);

  const [knittingRows, setKnittingRows] = useState<FabricRow[]>([
    { id: "knit-1", description: "F. Terry", unit: undefined, rate: 0.3, value: undefined },
    { id: "knit-2", description: "Rib", unit: undefined, rate: 0.35, value: undefined },
    { id: "knit-3", description: "SJ", unit: undefined, rate: 0.15, value: undefined },
  ]);

  const [dyeingRows, setDyeingRows] = useState<FabricRow[]>([
    { id: "dye-1", description: "Avarage Color shade", unit: undefined, rate: 1.0, value: undefined },
    { id: "dye-2", description: "Peach", unit: undefined, rate: 0.53, value: undefined },
    { id: "dye-3", description: "Brush", unit: undefined, rate: 0.4, value: undefined },
    { id: "dye-4", description: "Peach & Brush", unit: undefined, rate: 0.67, value: undefined },
    { id: "dye-5", description: "Heat set", unit: undefined, rate: 0.25, value: undefined },
  ]);

  const [printEmbRows, setPrintEmbRows] = useState<FabricRow[]>([
    { id: "print-1", description: "AOP", unit: undefined, rate: 1.6, value: undefined },
    { id: "print-2", description: "Screen print", unit: undefined, rate: undefined, value: undefined },
    { id: "print-3", description: "Emb (Chest + Back)", unit: undefined, rate: undefined, value: undefined },
    { id: "print-4", description: "Wash", unit: undefined, rate: undefined, value: undefined },
  ]);

  const updateRows = (rows: FabricRow[], setRows: any, id: string, field: keyof FabricRow, value: any) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        let newValue = value;
        // Convert string input to number for unit and rate
        if (field === "unit" || field === "rate") {
          newValue = Number(value);
        }
        const updatedRow = { ...row, [field]: newValue };
        if (field === "unit" || field === "rate") {
          updatedRow.value = Number(updatedRow.unit) * Number(updatedRow.rate) || 0;
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
      unit: undefined, // <-- remove default 0
      rate: undefined, // <-- remove default 0
      value: undefined, // <-- remove default 0
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (rows: FabricRow[], setRows: any, id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const calculateTotal = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
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
                    type="string"
                    value={row.unit}
                    onChange={(e) => updateRows(rows, setRows, row.id, "unit", e.target.value)}
                    className="h-8 text-right text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="string"
                    value={row.rate}
                    onChange={(e) => updateRows(rows, setRows, row.id, "rate", e.target.value)}
                    className="h-8 text-right text-sm"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="string"
                    value={Number(row.value) ? Number(row.value).toFixed(2) : "0.00"}
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
                    <Trash2 className="h-4 w-4  text-red-600" />
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

  const totalFabricCost =
    (Number(calculateTotal(yarnRows)) || 0) +
    (Number(calculateTotal(knittingRows)) || 0) +
    (Number(calculateTotal(dyeingRows)) || 0) +
    (Number(calculateTotal(printEmbRows)) || 0);

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
            <span className="text-primary">
              ${Number(totalFabricCost) ? Number(totalFabricCost).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FabricCostSection;
