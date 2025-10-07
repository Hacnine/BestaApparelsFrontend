import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface OtherRow {
  id: string;
  label: string;
  value: number;
}

interface OthersSectionProps {
  data: any[];
  onChange: (data: any[]) => void;
}

const OthersSection = ({ data, onChange }: OthersSectionProps) => {
  const [rows, setRows] = useState<OtherRow[]>(data);

  const updateRow = (id: string, field: keyof OtherRow, value: any) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const addRow = () => {
    const newRow: OtherRow = {
      id: `other-${Date.now()}`,
      label: "New Field",
      value: 0,
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

  const total = rows.reduce((sum, row) => sum + (parseFloat(row.value as any) || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Others (Custom Fields)</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No custom fields added yet.</p>
            <p className="text-sm mt-2">Click "Add Field" to add custom cost items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Label</th>
                  <th className="text-right p-3 font-medium">Value ($)</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Input
                        value={row.label}
                        onChange={(e) => updateRow(row.id, "label", e.target.value)}
                        className="max-w-md"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={row.value}
                        onChange={(e) => updateRow(row.id, "value", e.target.value)}
                        className="text-right"
                      />
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRow(row.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {rows.length > 0 && (
                  <tr className="border-t-2 font-semibold bg-muted/50">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-right">${total.toFixed(2)}</td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default OthersSection;
