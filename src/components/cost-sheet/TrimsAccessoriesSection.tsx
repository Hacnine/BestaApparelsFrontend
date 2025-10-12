import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil } from "lucide-react";

interface TrimRow {
  id: string;
  description: string;
  cost: string;
}

interface TrimsAccessoriesSectionChange {
  rows: TrimRow[];
  json: any;
}

interface TrimsAccessoriesSectionProps {
  data: any;
  onChange?: (data: TrimsAccessoriesSectionChange) => void;
  mode?: "create" | "edit" | "show";
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

const TrimsAccessoriesSection = ({
  data,
  onChange,
  mode = "create",
}: TrimsAccessoriesSectionProps) => {
  // Defensive copy to avoid reference issues
  const [rows, setRows] = useState<TrimRow[]>(
    Array.isArray(data?.rows)
      ? data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`, // Ensure unique id
        }))
      : defaultTrims.map((trim, index) => ({
          id: `trim-${index}`,
          description: trim,
          cost: "",
        }))
  );
  const [adjustmentPercent, setAdjustmentPercent] = useState(
    typeof data?.adjustmentPercent === "number" ? data.adjustmentPercent : 8
  );
  const [editMode, setEditMode] = useState(mode === "edit" || mode === "create");

  useEffect(() => {
    if (Array.isArray(data?.rows)) {
      setRows(
        data.rows.map((row: any, idx: number) => ({
          ...row,
          id: row.id ?? `trim-${idx}-${Date.now()}`, // Ensure unique id
        }))
      );
      if (typeof data.adjustmentPercent === "number") {
        setAdjustmentPercent(data.adjustmentPercent);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isEditable = editMode && (mode === "edit" || mode === "create");

  const handleRowsChange = (updatedRows: TrimRow[]) => {
    setRows(updatedRows);
    if (onChange) {
      onChange({
        rows: updatedRows,
        json: getTrimsAccessoriesJson(updatedRows),
      });
    }
  };

  const handleDecimalChange = (
    id: string,
    field: keyof TrimRow,
    value: string
  ) => {
    if (/^\d*\.?\d*$/.test(value)) {
      updateRow(id, field, value);
    }
  };

  // Fix: Only update the changed field for the correct row
  const updateRow = (id: string, field: keyof TrimRow, value: any) => {
    setRows(prevRows =>
      prevRows.map((row) =>
        row.id === id
          ? { ...row, [field]: value }
          : row
      )
    );
    if (onChange) {
      const updatedRows = rows.map((row) =>
        row.id === id
          ? { ...row, [field]: value }
          : row
      );
      onChange({
        rows: updatedRows,
        json: getTrimsAccessoriesJson(updatedRows),
      });
    }
  };

  const addRow = () => {
    const newRow: TrimRow = {
      id: `trim-${Date.now()}`,
      description: "New Item",
      cost: "",
    };
    const updatedRows = [...rows, newRow];
    handleRowsChange(updatedRows);
  };

  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    handleRowsChange(updatedRows);
  };

  const subtotal = rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);
  const adjustment = subtotal * (adjustmentPercent / 100);
  const totalAccessoriesCost = subtotal + adjustment;

  const getTrimsAccessoriesJson = (rowsArg: TrimRow[] = rows) => {
    return {
      tableName: "Trims & Accessories",
      columns: ["Item Description", "USD / Dozen"],
      rows: rowsArg.map((row) => ({
        description: row.description,
        cost: row.cost,
      })),
      subtotal: rowsArg.reduce((sum, row) => sum + (Number(row.cost) || 0), 0),
      adjustmentPercent,
      adjustment,
      totalAccessoriesCost,
    };
  };

  const sendTrimsAccessoriesToBackend = async () => {
    const payload = getTrimsAccessoriesJson();
    try {
      await fetch("/api/trims-accessories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Optionally show success message
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">Trims & Accessories</CardTitle>
        {/* {mode === "show" && !editMode && (
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => setEditMode(true)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )} */}
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Item Description</th>
                <th className="text-right p-3 font-medium">USD / Dozen</th>
                {isEditable && <th className="w-12"></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    {isEditable ? (
                      <Input
                        value={row.description}
                        onChange={e => updateRow(row.id, "description", e.target.value)}
                        className="max-w-md"
                      />
                    ) : (
                      row.description
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {isEditable ? (
                      <Input
                        type="text"
                        value={row.cost ?? ""}
                        onChange={e => handleDecimalChange(row.id, "cost", e.target.value)}
                        className="text-right"
                        placeholder="0.000"
                      />
                    ) : (
                      Number(row.cost).toFixed(3)
                    )}
                  </td>
                  {isEditable && (
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
                  )}
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-medium">Add Adjustment</span>
              <span className="w-20 h-8">{adjustmentPercent}%</span>
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
        {isEditable && (
          <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TrimsAccessoriesSection;
