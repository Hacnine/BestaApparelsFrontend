import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummarySectionShowProps {
  summary: any;
  fabricData: any;
  trimsData: any[];
  othersData: any;
}

const SummarySectionShow = ({
  summary = {},
  fabricData,
  trimsData,
  othersData,
}: SummarySectionShowProps) => {
  // Calculate fabric cost
  const getFabricCost = () => {
    if (fabricData?.totalFabricCost !== undefined) {
      return fabricData.totalFabricCost;
    }
    if (fabricData?.json?.totalFabricCost !== undefined) {
      return fabricData.json.totalFabricCost;
    }
    let total = 0;
    if (fabricData?.yarnRows && Array.isArray(fabricData.yarnRows)) {
      total += fabricData.yarnRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    if (fabricData?.knittingRows && Array.isArray(fabricData.knittingRows)) {
      total += fabricData.knittingRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    if (fabricData?.dyeingRows && Array.isArray(fabricData.dyeingRows)) {
      total += fabricData.dyeingRows.reduce(
        (sum: number, row: any) => sum + (Number(row.value) || 0),
        0
      );
    }
    return total;
  };
  const fabricCost = getFabricCost();

  // Calculate accessories cost
  const accessoriesCost =
    typeof (trimsData as any)?.subtotal === "number"
      ? (trimsData as any).subtotal
      : typeof (trimsData as any)?.totalAccessoriesCost === "number"
      ? (trimsData as any).totalAccessoriesCost
      : Array.isArray(trimsData)
      ? trimsData.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
      : 0;

  // Dynamically calculate total for 'othersData' if it's an array
  let othersTotal = 0;
  if (Array.isArray(othersData)) {
    othersTotal = othersData.reduce((sum, item) => {
      const val = parseFloat(item.value);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  } else if (typeof othersData?.total === "number") {
    othersTotal = othersData.total;
  } else if (typeof othersData?.json?.total === "number") {
    othersTotal = othersData.json.total;
  }

  // Get values from summary data or calculate defaults
  const summaryData = summary.json || summary;
  const factoryCM = summaryData.factoryCM !== undefined ? Number(summaryData.factoryCM) : 14.0;
  const profitPercent = summaryData.profitPercent !== undefined ? Number(summaryData.profitPercent) : 0;
  const commercialPercent = summaryData.commercialPercent !== undefined ? Number(summaryData.commercialPercent) : 15;

  const totalCost = fabricCost + accessoriesCost + factoryCM + othersTotal;
  const commercialCost = totalCost * (commercialPercent / 100);
  const totalCostWithCommercial = totalCost + commercialCost;
  const profitCost = totalCostWithCommercial * (profitPercent / 100);
  const fobPrice = totalCostWithCommercial + profitCost;
  const pricePerPiece = fobPrice / 12;

  // Table rows for summary fields
  const summaryRows: { label: string; value: any }[] = [
    { label: "Fabric Cost / Dzn Garments", value: fabricCost },
    { label: "Accessories Cost / Dzn Garments", value: accessoriesCost },
    { label: "Factory CM / Dzn Garments", value: factoryCM },
    { label: "Others Cost / Dzn Garments", value: othersTotal },
    {
      label: `Commercial Cost (${commercialPercent}%)`,
      value: commercialCost,
    },
    { label: "Total Cost (with Commercial)", value: totalCostWithCommercial },
    {
      label: `Profit (${profitPercent}%)`,
      value: profitCost,
    },
    { label: "FOB Price / Dzn", value: fobPrice },
    { label: "Price / Pc Garments", value: pricePerPiece },
  ];

  return (
    <Card className="print:p-0 print:shadow-none print:border-none print:bg-white">
      <CardHeader className="print:p-0 print:mb-0 print:border-none print:bg-white">
        <CardTitle className="text-lg print:text-base print:mb-0">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="print:p-0 print:space-y-0 print:bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-muted/30">Label</th>
                <th className="border p-2 bg-muted/30">Value ($)</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{row.label}</td>
                  <td className="border p-2 text-right">
                    {typeof row.value === "number"
                      ? `$${row.value.toFixed(3)}`
                      : row.value ?? "$0.000"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySectionShow;