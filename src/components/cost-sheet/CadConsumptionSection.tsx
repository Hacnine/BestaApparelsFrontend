import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface CadRow {
  id: string;
  fieldName: string;
  weight: number;
  price: number;
  value: number;
}

interface CadConsumptionSectionProps {
  data: any[];
  onChange: (data: any[]) => void;
}

const defaultFields = [
  { fieldName: "Body", weight: 0, price: 0 },
  { fieldName: "Rib", weight: 0, price: 0 },
  { fieldName: "SJ–NT, Lining", weight: 0, price: 0 },
  { fieldName: "Contrast Body", weight: 0, price: 0 },
];

const CadConsumptionSection = ({ data, onChange }: CadConsumptionSectionProps) => {
  const [rows, setRows] = useState<CadRow[]>([]);

  useEffect(() => {
    if (data.length === 0) {
      const initialRows = defaultFields.map((field, index) => ({
        id: `cad-${index}`,
        ...field,
        weight: undefined, // <-- remove default 0
        price: undefined,  // <-- remove default 0
        value: undefined,  // <-- remove default 0
      }));
      setRows(initialRows);
      onChange(initialRows);
    } else {
      setRows(data);
    }
  }, []);

  const updateRow = (id: string, field: keyof CadRow, value: any) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        let newValue = value;
        if (field === "weight" || field === "price") {
          newValue = Number(value);
        }
        const updatedRow = { ...row, [field]: newValue };
        if (field === "weight" || field === "price") {
          updatedRow.value = Number(updatedRow.weight) * Number(updatedRow.price) || 0;
        }
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const addRow = () => {
    const newRow: CadRow = {
      id: `cad-${Date.now()}`,
      fieldName: "New Field",
      weight: undefined, // <-- remove default 0
      price: undefined,  // <-- remove default 0
      value: undefined,  // <-- remove default 0
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

  const totalWeight = rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
  const totalValue = rows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);

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
                <th className="text-right p-3 font-medium">Price in $</th>
                <th className="text-right p-3 font-medium">Value in $</th>
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
                      type="string"
                      value={Number(row.weight) || ""}
                      onChange={(e) => updateRow(row.id, "weight", e.target.value)}
                      className="text-right"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="string"
                      value={Number(row.price) || ""}
                      onChange={(e) => updateRow(row.id, "price", e.target.value)}
                      className="text-right"
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="string"
                      value={Number(row.value) ? Number(row.value).toFixed(2) : "0.00"}
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
                      <Trash2 className="h-4 w-4  text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 font-semibold bg-muted/50">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">
                  {Number(totalWeight) ? Number(totalWeight).toFixed(2) : "0.00"}
                </td>
                <td className="p-3"></td>
                <td className="p-3 text-right">
                  ${Number(totalValue) ? Number(totalValue).toFixed(2) : "0.00"}
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
      </CardContent>
    </Card>
  );
};

export default CadConsumptionSection;
