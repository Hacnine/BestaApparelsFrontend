import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FabricRow {
  id: string;
  fieldName: string;
  unit: "";
  rate: "";
  value: number;
}

interface FabricCostSectionProps {
  data: any;
  onChange: (data: any) => void;
}

const FabricCostSection = ({ data, onChange }: FabricCostSectionProps) => {
  const [yarnRows, setYarnRows] = useState<FabricRow[]>([
    {
      id: "yarn-1",
      fieldName: "30/1, 100% Cotton",
      unit: "",
      rate: "",
      value: 0,
    },
    {
      id: "yarn-2",
      fieldName: "20/1, 100% Cotton",
      unit: "",
      rate: "",
      value: 0,
    },
  ]);

  const [knittingRows, setKnittingRows] = useState<FabricRow[]>([
    {
      id: "knit-1",
      fieldName: "F. Terry",
      unit: "",
      rate: "",
      value: 0,
    },
    {
      id: "knit-2",
      fieldName: "Rib",
      unit: "",
      rate: "",
      value: 0,
    },
    {
      id: "knit-3",
      fieldName: "SJ",
      unit: "",
      rate: "",
      value: 0,
    },
  ]);

  const [dyeingRows, setDyeingRows] = useState<FabricRow[]>([
    {
      id: "dye-1",
      fieldName: "Avarage Color shade",
      unit: "",
      rate: "",
      value: 0,
    },
    {
      id: "dye-2",
      fieldName: "Peach",
      unit: "",
      rate: "",
      value: 0,
    },
    {
      id: "dye-3",
      fieldName: "Brush",
      unit: "",
      rate: "",
      value: 0,
    },
    {
      id: "dye-4",
      fieldName: "Peach & Brush",
      unit: "",
      rate: "",
      value: 0,
    },
    {
      id: "dye-5",
      fieldName: "Heat set",
      unit: "",
      rate: "",
      value: 0,
    },
  ]);


  const handleDecimalChange = (
    rows: FabricRow[],
    setRows: any,
    id: string,
    field: keyof FabricRow,
    newValue: string
  ) => {
    if (/^\d*\.?\d*$/.test(newValue)) {
      updateRows(rows, setRows, id, field, newValue);
    }
  };

  const updateRows = (
    rows: FabricRow[],
    setRows: any,
    id: string,
    field: keyof FabricRow,
    value: any
  ) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        updatedRow.value =
          Number(updatedRow.unit) * Number(updatedRow.rate) || 0;
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
      fieldName: "New Item",
      unit: "", 
      rate: "", 
      value: 0, 
    };
    setRows([...rows, newRow]);
  };

  const deleteRow = (rows: FabricRow[], setRows: any, id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const calculateTotal = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (Number(row.value) || 0), 0);
  };

  const calculateTotalUnit = (rows: FabricRow[]) => {
    return rows.reduce((sum, row) => sum + (Number(row.unit) || 0), 0);
  };

  const updateTotalData = () => {
    const yarnTotal = calculateTotal(yarnRows);
    const knittingTotal = calculateTotal(knittingRows);
    const dyeingTotal = calculateTotal(dyeingRows);
    const totalCost = yarnTotal + knittingTotal + dyeingTotal;

    onChange({
      yarnRows,
      knittingRows,
      dyeingRows,
      yarnTotal,
      knittingTotal,
      dyeingTotal,
      totalCost,
    });
  };

  const getFabricCostJson = () => {
    return {
      tableName: "Fabric Cost",
      yarnRows,
      knittingRows,
      dyeingRows,
      yarnTotal: calculateTotal(yarnRows),
      knittingTotal: calculateTotal(knittingRows),
      dyeingTotal: calculateTotal(dyeingRows),
      totalFabricCost,
    };
  };

  const handleRowsChange = () => {
    onChange({
      rows: {
        yarnRows,
        knittingRows,
        dyeingRows,
      },
      json: getFabricCostJson(),
    });
  };

  useEffect(() => {
    handleRowsChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yarnRows, knittingRows, dyeingRows]);

  const renderSubsection = (
    title: string,
    rows: FabricRow[],
    setRows: any,
    prefix: string
  ) => {
    const totalUnit = calculateTotalUnit(rows);
    const totalValue = calculateTotal(rows);
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-2 text-sm font-medium">
                  Field Name
                </th>
                <th className="text-right p-2 text-sm font-medium">Unit</th>
                <th className="text-right p-2 text-sm font-medium">Rate ($)</th>
                <th className="text-right p-2 text-sm font-medium">
                  Value ($)
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-muted/20">
                  <td className="p-2">
                    <Input
                      value={row.fieldName}
                      onChange={(e) =>
                        updateRows(
                          rows,
                          setRows,
                          row.id,
                          "fieldName",
                          e.target.value
                        )
                      }
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      value={row.unit}
                      onChange={(e) =>
                        handleDecimalChange(
                          rows,
                          setRows,
                          row.id,
                          "unit",
                          e.target.value
                        )
                      }
                      className="h-8 text-right text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      value={row.rate ?? ""}
                      onChange={(e) =>
                        handleDecimalChange(
                          rows,
                          setRows,
                          row.id,
                          "rate",
                          e.target.value
                        )
                      }
                      className="h-8 text-right text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      value={row.value ? row.value.toFixed(2) : "0.00"}
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
              <tr className="font-semibold bg-muted/10">
                <td className="p-2 text-left">Total</td>
                <td className="p-2 text-right">
                  {totalUnit ? totalUnit.toFixed(2) : "0.00"}
                </td>
                <td className="p-2"></td>
                <td className="p-2 text-right">
                  {totalValue ? totalValue.toFixed(2) : "0.00"}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button
          onClick={() => addRow(rows, setRows, prefix)}
          variant="outline"
          size="sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Field
        </Button>
      </div>
    );
  };

  const totalFabricCost =
    (Number(calculateTotal(yarnRows)) || 0) +
    (Number(calculateTotal(knittingRows)) || 0) +
    (Number(calculateTotal(dyeingRows)) || 0) 
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
       
        <Separator />
        <div className="pt-4 border-t-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total Fabric Cost (USD / Dozen Garments)</span>
            <span className="text-primary">
              $
              {Number(totalFabricCost)
                ? Number(totalFabricCost).toFixed(2)
                : "0.00"}
            </span>
          </div>
          <Button
            className="mt-4"
            variant="default"
            // onClick={sendFabricCostToBackend}
          >
            Save Fabric Cost Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FabricCostSection;
