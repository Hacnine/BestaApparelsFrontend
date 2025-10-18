import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface TrimRow {
  id: string;
  description: string;
  cost: string;
}

interface TrimsAccessoriesSectionCreateProps {
  data: any;
  onChange?: (data: { rows: TrimRow[]; json: any }) => void;
}

const defaultTrims = [
  "RFID",
  "Main Label",
  "Price Hangtag",
  "License Hangtag",
  "Hangtag String",
  "Care Label",
  "Canvas label",
  "Sewing Thread",
  "single pc poly sticker",
  "Blister poly sticker",
  "Carton Sticker",
  "Size sticker",
  "Snap Button",
  "Wood Button",
  "Ring Eyelet",
  "Twill tape",
  "Tube Tape",
  "Hanger Loop",
  "Zipper Long",
  "woven Fabric",
  "CMIA Hang Tag",
  "Poly",
  "Carton",
  "Mobilon tape",
  "Elastic",
  "Others",
];

const TrimsAccessoriesSectionCreate = ({ data, onChange }: TrimsAccessoriesSectionCreateProps) => {
  const [rows, setRows] = useState<TrimRow[]>(
    Array.isArray(data?.rows)
      ? data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`,
        }))
      : defaultTrims.map((trim, index) => ({
          id: `trim-${index}`,
          description: trim,
          cost: "",
        }))
  );

  useEffect(() => {
    if (Array.isArray(data?.rows)) {
      setRows(
        data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`,
        }))
      );
    }
  }, [data]);

  const getTrimsAccessoriesJson = (rowsArg: TrimRow[]) => {
    const subtotal = rowsArg.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);
    return {
      tableName: "Trims & Accessories",
      columns: ["Item Description", "USD / Dozen"],
      rows: rowsArg.map((row) => ({
        description: row.description,
        cost: row.cost,
      })),
      subtotal,
      totalAccessoriesCost: subtotal,
    };
  };

  const handleRowsChange = (updatedRows: TrimRow[]) => {
    setRows(updatedRows);
    if (onChange) {
      onChange({
        rows: updatedRows,
        json: getTrimsAccessoriesJson(updatedRows),
      });
    }
  };

  const handleDecimalChange = (id: string, field: keyof TrimRow, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      updateRow(id, field, value);
    }
  };

  const updateRow = (id: string, field: keyof TrimRow, value: any) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    handleRowsChange(updatedRows);
  };

  const addRow = () => {
    const newRow: TrimRow = {
      id: `trim-${Date.now()}`,
      description: "New Item",
      cost: "",
    };
    handleRowsChange([...rows, newRow]);
  };

  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    handleRowsChange(updatedRows);
  };

  const subtotal = rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">Trims & Accessories</CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
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
                  <td className="p-3 text-right">
                    <Input
                      type="text"
                      value={row.cost ?? ""}
                      onChange={(e) => handleDecimalChange(row.id, "cost", e.target.value)}
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
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 space-y-3 pt-6 border-t-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Accessories Cost</span>
            <span className="font-semibold">
              ${Number(subtotal) ? Number(subtotal).toFixed(3) : "0.000"}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg pt-3 border-t">
            <span className="font-bold">Total Accessories Cost</span>
            <span className="font-bold text-primary">
              ${Number(subtotal) ? Number(subtotal).toFixed(3) : "0.000"} /Dzn
            </span>
          </div>
        </div>
        <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrimsAccessoriesSectionCreate;
