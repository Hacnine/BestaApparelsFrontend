import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

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
  onChange: (data: CadConsumptionSectionChange) => void;
}

const defaultFields = [
  { fieldName: "Body", weight: "", percent: "" },
  { fieldName: "Rib", weight: "", percent: "" },
  { fieldName: "SJ-NT, Lining", weight: "", percent: "" },
  { fieldName: "Contrast Body", weight: "", percent: "" },
];

const CadConsumptionSection = ({ data, onChange }: CadConsumptionSectionProps) => {
  const [rows, setRows] = useState<CadRow[]>([]);

  const handleRowsChange = (updatedRows: CadRow[]) => {
    setRows(updatedRows);
    onChange({
      rows: updatedRows,
      json: getCadConsumptionJson(),
    });
  };

  useEffect(() => {
    if (data.length === 0) {
      const initialRows = defaultFields.map((field, index) => ({
        id: `cad-${index}`,
        ...field,
        value: 0,
      }));
      setRows(initialRows);
      onChange({
        rows: initialRows,
        json: getCadConsumptionJson(),
      });
    } else {
      setRows(data);
    }
  }, [data, onChange]);

  const handleDecimalChange = (id: string, field: "weight" | "percent", newValue: string) => {
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

  const getCadConsumptionJson = () => {
    return {
      tableName: "CAD Consumption / Dz",
      columns: ["Field Name", "Weight (kg)", "With %", "Fabric Consumption"],
      rows: rows.map(row => ({
        fieldName: row.fieldName,
        weight: row.weight,
        percent: row.percent,
        value: row.value,
      })),
      totalWeight,
      totalValue,
    };
  };

  const sendCadConsumptionToBackend = async () => {
    const payload = getCadConsumptionJson();
    try {
      await fetch("/api/cad-consumption", {
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">CAD Consumption / Dz</CardTitle>
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
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <Input
                      value={row.fieldName}
                      onChange={(e) => updateRow(row.id, "fieldName", e.target.value)}
                      className="max-w-xs"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={row.weight ?? ""}
                      onChange={(e) => handleDecimalChange(row.id, "weight", e.target.value)}
                      className="text-right no-arrows"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={row.percent ?? ""}
                      onChange={(e) => handleDecimalChange(row.id, "percent", e.target.value)}
                      className="text-right no-arrows"
                      placeholder="0.00"
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
              <tr className="border-b-2 font-semibold bg-muted/50">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">
                  {totalWeight ? totalWeight.toFixed(2) : "0.00"}
                </td>
                <td className="p-3 text-right">
                 
                </td>
                <td className="p-3 text-right">
                  ${totalValue ? totalValue.toFixed(2) : "0.00"}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button onClick={addRow} variant="outline" size="sm" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
        <Button 
        // onClick={sendCadConsumptionToBackend} 
        variant="default" size="sm"
         className="mt-4 ml-2">
          Save CAD Consumption Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default CadConsumptionSection;