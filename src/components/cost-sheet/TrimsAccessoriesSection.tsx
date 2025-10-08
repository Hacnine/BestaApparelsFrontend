import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface TrimRow {
  id: string;
  description: string;
  cost: number;
}

interface TrimsAccessoriesSectionProps {
  data: any[];
  onChange: (data: any[]) => void;
}

const defaultTrims = [
  "RFID",
  "Main Label ($0.15)",
  "Price Hangtag ($0.15)",
  "License Hangtag (.192)",
  "Hangtag String (.060)",
  "Care Label ($0.15)",
  "Canvas label",
  "Sewing Thread ($0.50)",
  "single pc poly sticker ($0.15)",
  "Blister poly sticker ($0.11)",
  "Carton Sticker ($0.011)",
  "Size sticker ($0.10)",
  "Snap Button ($0.45)",
  "Wood Button",
  "Ring Eyelet ($0.45)",
  "Twill tape (0.5 & 1 cm)",
  "Tube Tape",
  "Hanger Loop",
  "Zipper Long",
  "woven Fabric",
  "CMIA Hang Tag",
  "Poly ($0.30)",
  "Carton ($0.35)",
  "Mobilon tape",
  "Elastic",
  "Others",
];

const TrimsAccessoriesSection = ({ data, onChange }: TrimsAccessoriesSectionProps) => {
  const [rows, setRows] = useState<TrimRow[]>([]);
  const [adjustmentPercent, setAdjustmentPercent] = useState(8);

  useEffect(() => {
    if (data.length === 0) {
      const initialRows = defaultTrims.map((trim, index) => ({
        id: `trim-${index}`,
        description: trim,
        cost: undefined, // <-- remove default 0
      }));
      setRows(initialRows);
      onChange(initialRows);
    } else {
      setRows(data);
    }
  }, []);

  const updateRow = (id: string, field: keyof TrimRow, value: any) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]: field === "cost" ? Number(value) : value,
          }
        : row
    );
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const addRow = () => {
    const newRow: TrimRow = {
      id: `trim-${Date.now()}`,
      description: "New Item",
      cost: undefined, // <-- remove default 0
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const subtotal = rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);
  const adjustment = subtotal * (adjustmentPercent / 100);
  const totalAccessoriesCost = subtotal + adjustment;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trims & Accessories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Item Description</th>
                <th className="text-right p-3 font-medium">USD / Dozen</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <Input
                      value={row.description}
                      onChange={(e) => updateRow(row.id, "description", e.target.value)}
                      className="max-w-md"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="string"
                      value={Number(row.cost) || ""}
                      onChange={(e) => updateRow(row.id, "cost", e.target.value)}
                      className="text-right"
                      placeholder="0.000"
                    />
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(row.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4  text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>

        <div className="mt-6 space-y-3 pt-6 border-t-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Accessories Cost</span>
            <span className="font-semibold">
              ${Number(subtotal) ? Number(subtotal).toFixed(3) : "0.000"}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">Add Adjustment</span>
              <Input
                type="string"
                value={adjustmentPercent}
                onChange={(e) => setAdjustmentPercent(Number(e.target.value) || 0)}
                className="w-20 h-8"
              />
              <span>%</span>
            </div>
            <span className="font-semibold">
              ${Number(adjustment) ? Number(adjustment).toFixed(3) : "0.000"}
            </span>
          </div>

          <div className="flex justify-between items-center text-lg pt-3 border-t">
            <span className="font-bold">Total Accessories Cost</span>
            <span className="font-bold text-primary">
              ${Number(totalAccessoriesCost) ? Number(totalAccessoriesCost).toFixed(3) : "0.000"} /Dzn
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrimsAccessoriesSection;
