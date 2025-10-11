import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Pencil } from "lucide-react";

interface CadRow {
  id: string;
  fieldName: string;
  weight?: string;
  percent?: string;
  value?: number;
}

interface CadConsumptionSectionChange {
  rows: CadRow[];
  json: any;
}

interface CadConsumptionSectionProps {
  data: CadRow[];
  onChange?: (data: CadConsumptionSectionChange) => void;
  mode?: "create" | "edit" | "show";
}

const defaultFields = [
  { fieldName: "Body", weight: "", percent: "" },
  { fieldName: "Rib", weight: "", percent: "" },
  { fieldName: "SJ-NT, Lining", weight: "", percent: "" },
  { fieldName: "Contrast Body", weight: "", percent: "" },
];

const CadConsumptionSection = ({
  data,
  onChange,
  mode = "create",
}: CadConsumptionSectionProps) => {
  const [rows, setRows] = useState<CadRow[]>([]);
  const [editMode, setEditMode] = useState(mode === "edit" || mode === "create");

  useEffect(() => {
    if (data && data.length > 0) {
      setRows(data);
    } else {
      const initialRows = defaultFields.map((field, index) => ({
        id: `cad-${index}`,
        ...field,
        value: 0,
      }));
      setRows(initialRows);
      if (onChange) {
        onChange({
          rows: initialRows,
          json: getCadConsumptionJson(initialRows),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleRowsChange = (updatedRows: CadRow[]) => {
    setRows(updatedRows);
    if (onChange) {
      onChange({
        rows: updatedRows,
        json: getCadConsumptionJson(updatedRows),
      });
    }
  };

  const handleDecimalChange = (
    id: string,
    field: "weight" | "percent",
    newValue: string
  ) => {
    if (/^\d*\.?\d*$/.test(newValue)) {
      updateRow(id, field, newValue);
    }
  };

  const updateRow = (id: string, field: keyof CadRow, value: any) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        const weightNum = Number(updatedRow.weight) || 0;
        const percentNum = Number(updatedRow.percent) || 0;
        updatedRow.value = weightNum + (weightNum * percentNum / 100);
        return updatedRow;
      }
      return row;
    });
    handleRowsChange(updatedRows);
  };

  const addRow = () => {
    const newRow: CadRow = {
      id: `cad-${Date.now()}`,
      fieldName: "New Field",
      weight: "",
      percent: "",
      value: 0,
    };
    const updatedRows = [...rows, newRow];
    handleRowsChange(updatedRows);
  };

  const deleteRow = (id: string) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    handleRowsChange(updatedRows);
  };

  const totalWeight = rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
  const totalValue = rows.reduce((sum, row) => sum + (row.value || 0), 0);

  const getCadConsumptionJson = (rowsArg: CadRow[] = rows) => {
    return {
      tableName: "CAD Consumption / Dz",
      columns: ["Field Name", "Weight (kg)", "With %", "Fabric Consumption"],
      rows: rowsArg.map((row) => ({
        fieldName: row.fieldName,
        weight: row.weight,
        percent: row.percent,
        value: row.value,
      })),
      totalWeight: rowsArg.reduce((sum, row) => sum + (Number(row.weight) || 0), 0),
      totalValue: rowsArg.reduce((sum, row) => sum + (row.value || 0), 0),
    };
  };

  const isEditable = editMode && (mode === "edit" || mode === "create");

  return (
    <Card>
      <CardHeader >
       <div className="flex items-center justify-between">
         <CardTitle className="text-lg">CAD Consumption / Dz</CardTitle>
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
       </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Field Name</th>
                <th className="text-right p-3 font-medium">Weight (kg)</th>
                <th className="text-right p-3 font-medium">With %</th>
                <th className="text-right p-3 font-medium">Fabric Consumption</th>
                {isEditable && <th className="w-12"></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <Input
                      value={row.fieldName}
                      onChange={(e) =>
                        isEditable && updateRow(row.id, "fieldName", e.target.value)
                      }
                      className="max-w-xs"
                      disabled={!isEditable}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={row.weight ?? ""}
                      onChange={(e) =>
                        isEditable && handleDecimalChange(row.id, "weight", e.target.value)
                      }
                      className="text-right no-arrows"
                      placeholder="0.00"
                      disabled={!isEditable}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={row.percent ?? ""}
                      onChange={(e) =>
                        isEditable && handleDecimalChange(row.id, "percent", e.target.value)
                      }
                      className="text-right no-arrows"
                      placeholder="0.00"
                      disabled={!isEditable}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="text"
                      value={row.value ? row.value.toFixed(2) : "0.00"}
                      readOnly
                      className="text-right bg-muted/50"
                    />
                  </td>
                  {isEditable && (
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRow(row.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={!isEditable}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
              <tr className="border-b-2 font-semibold bg-muted/50">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">
                  {totalWeight ? totalWeight.toFixed(2) : "0.00"}
                </td>
                <td className="p-3 text-right"></td>
                <td className="p-3 text-right">
                 {totalValue ? totalValue.toFixed(2) : "0.00"}
                </td>
                {isEditable && <td></td>}
              </tr>
            </tbody>
          </table>
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

export default CadConsumptionSection;