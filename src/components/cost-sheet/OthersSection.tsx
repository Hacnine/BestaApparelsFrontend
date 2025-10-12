import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil } from "lucide-react";

interface OtherRow {
  id: string;
  label: string;
  value: number;
}

interface OthersSectionChange {
  rows: OtherRow[];
  json: any;
}

interface OthersSectionProps {
  data: any;
  onChange?: (data: OthersSectionChange) => void;
  mode?: "create" | "edit" | "show";
}

const OthersSection = ({ data, onChange, mode = "create" }: OthersSectionProps) => {
  const [rows, setRows] = useState<OtherRow[]>(
    Array.isArray(data?.rows)
      ? data.rows
      : []
  );
  const [editMode, setEditMode] = useState(mode === "edit" || mode === "create");

  useEffect(() => {
    if (Array.isArray(data?.rows)) {
      setRows(data.rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isEditable = editMode && (mode === "edit" || mode === "create");

  const handleRowsChange = (updatedRows: OtherRow[]) => {
    setRows(updatedRows);
    if (onChange) {
      onChange({
        rows: updatedRows,
        json: {
          tableName: "Others",
          columns: ["Label", "Value"],
          rows: updatedRows,
          total: updatedRows.reduce((sum, row) => sum + (Number(row.value) || 0), 0),
        },
      });
    }
  };

  const updateRow = (id: string, field: keyof OtherRow, value: any) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]: field === "value" ? Number(value) : value,
          }
        : row
    );
    handleRowsChange(updatedRows);
  };

  const addRow = () => {
    const newRow: OtherRow = {
      id: `other-${Date.now()}`,
      label: "New Field",
      value: 0,
    };
    const updatedRows = [...rows, newRow];
    handleRowsChange(updatedRows);
  };

  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    handleRowsChange(updatedRows);
  };

  const total = rows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Others (Custom Fields)</CardTitle>
        {mode === "show" && !editMode && (
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => setEditMode(true)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
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
                  {isEditable && <th className="w-12"></th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <Input
                        value={row.label}
                        onChange={(e) => isEditable && updateRow(row.id, "label", e.target.value)}
                        className="max-w-md"
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="string"
                        value={Number(row.value) || ""}
                        onChange={(e) => isEditable && updateRow(row.id, "value", e.target.value)}
                        className="text-right"
                        readOnly={!isEditable}
                      />
                    </td>
                    {isEditable && (
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRow(row.id)}
                          className="text-destructive hover:text-destructive"
                          readOnly={!isEditable}
                        >
                          <Trash2 className="h-4 w-4  text-red-600" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {rows.length > 0 && (
                  <tr className="border-t-2 font-semibold bg-muted/50">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-right">
                      ${Number(total) ? Number(total).toFixed(2) : "0.00"}
                    </td>
                    {isEditable && <td></td>}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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

export default OthersSection;
