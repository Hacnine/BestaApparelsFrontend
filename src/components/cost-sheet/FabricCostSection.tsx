import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface FabricRow {
  id: string;
  fieldName: string;
  unit: "";
  rate: "";
  value: number;
}

interface FabricCostSectionProps {
  data: any;
  onChange?: (data: any) => void;
  mode?: "create" | "edit" | "show";
}

const FabricCostSection = ({ data, onChange, mode = "create" }: FabricCostSectionProps) => {
  // Use backend data for initial state
  const initialYarnRows = data?.yarnRows || data?.json?.yarnRows || [
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
  ];
  const initialKnittingRows = data?.knittingRows || data?.json?.knittingRows || [
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
  ];
  const initialDyeingRows = data?.dyeingRows || data?.json?.dyeingRows || [
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
  ];

  const [yarnRows, setYarnRows] = useState<FabricRow[]>(data?.yarnRows || initialYarnRows);
  const [knittingRows, setKnittingRows] = useState<FabricRow[]>(data?.knittingRows || initialKnittingRows);
  const [dyeingRows, setDyeingRows] = useState<FabricRow[]>(data?.dyeingRows || initialDyeingRows);
  const [printEmbRows, setPrintEmbRows] = useState<FabricRow[]>([]);

  const isEditable = mode === "edit" || mode === "create";

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

    if (onChange) {
      onChange({
        rows: {
          yarnRows,
          knittingRows,
          dyeingRows,
        },
        json: {
          tableName: "Fabric Cost",
          yarnRows,
          knittingRows,
          dyeingRows,
          yarnTotal,
          knittingTotal,
          dyeingTotal,
          totalFabricCost: totalCost,
        }
      });
    }
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
    if (onChange) {
      onChange({
        rows: {
          yarnRows,
          knittingRows,
          dyeingRows,
        },
        json: getFabricCostJson(),
      });
    }
  };

  useEffect(() => {
    handleRowsChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yarnRows, knittingRows, dyeingRows]);

  // Table rendering similar to OthersSection
  const renderTableSection = (
    title: string,
    rows: FabricRow[],
    setRows: any,
    totalUnit: number,
    totalValue: number,
    prefix: string // <-- add prefix argument
  ) => (
    <div className="mb-6">
      <h4 className="font-semibold text-sm mb-2">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Field Name</th>
              <th className="text-right p-3 font-medium">Unit</th>
              <th className="text-right p-3 font-medium">Rate ($)</th>
              <th className="text-right p-3 font-medium">Value ($)</th>
              {isEditable && <th className="w-12"></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  {isEditable ? (
                    <Input
                      value={row.fieldName}
                      onChange={e => updateRows(rows, setRows, row.id, "fieldName", e.target.value)}
                      className="h-8 text-sm border-none"
                    />
                  ) : (
                    row.fieldName
                  )}
                </td>
                <td className="p-3 text-right">
                  {isEditable ? (
                    <Input
                      type="text"
                      value={row.unit}
                      onChange={e => handleDecimalChange(rows, setRows, row.id, "unit", e.target.value)}
                      className="h-8 text-right text-sm border-none"
                    />
                  ) : (
                    row.unit ? Number(row.unit).toFixed(2) : "0.00"
                  )}
                </td>
                <td className="p-3 text-right">
                  {isEditable ? (
                    <Input
                      type="text"
                      value={row.rate ?? ""}
                      onChange={e => handleDecimalChange(rows, setRows, row.id, "rate", e.target.value)}
                      className="h-8 text-right text-sm border-none"
                    />
                  ) : (
                    row.rate ? Number(row.rate).toFixed(2) : "0.00"
                  )}
                </td>
                <td className="p-3 text-right">
                  {row.value ? Number(row.value).toFixed(2) : "0.00"}
                </td>
                {isEditable && (
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => deleteRow(rows, setRows, row.id)}
                    >
                      <Trash2 className="h-4 w-4  text-red-600" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            <tr className="font-semibold bg-muted/10">
              <td className="p-3 text-left">Total</td>
              <td className="p-3 text-right">{totalUnit ? totalUnit.toFixed(2) : "0.00"}</td>
              <td className="p-3"></td>
              <td className="p-3 text-right">{totalValue ? totalValue.toFixed(2) : "0.00"}</td>
              {isEditable && <td></td>}
            </tr>
          </tbody>
        </table>
      </div>
      {isEditable && (
        <Button
          onClick={() => addRow(rows, setRows, prefix)}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      )}
    </div>
  );

  // Always calculate totalFabricCost from fields
  const totalFabricCost = (Number(calculateTotal(yarnRows)) || 0) +
    (Number(calculateTotal(knittingRows)) || 0) +
    (Number(calculateTotal(dyeingRows)) || 0);

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">Fabric Cost</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 print:p-0 print:space-y-0 print:bg-white">
        {renderTableSection(
          "Yarn Price",
          yarnRows,
          setYarnRows,
          calculateTotalUnit(yarnRows),
          calculateTotal(yarnRows),
          "yarn"
        )}
        <Separator />
        {renderTableSection(
          "Knitting",
          knittingRows,
          setKnittingRows,
          calculateTotalUnit(knittingRows),
          calculateTotal(knittingRows),
          "knit"
        )}
        <Separator />
        {renderTableSection(
          "Dyeing",
          dyeingRows,
          setDyeingRows,
          calculateTotalUnit(dyeingRows),
          calculateTotal(dyeingRows),
          "dye"
        )}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default FabricCostSection;

// In your handlePrint function (in CostSheetTable.tsx), add this to the print CSS:
    let styles = "";
    styles += `
      @media print {
        // ...existing print styles...
        input, .border-none {
          border: none !important;
          box-shadow: none !important;
        }
      }
    `;
