import React, { useState } from "react";
import { Card } from "../ui/card";
import { useGetCostSheetsQuery } from "@/redux/api/costSheetApi";
import { Button } from "@/components/ui/button";
import CadConsumptionSection from "./CadConsumptionSection";
import FabricCostSection from "./FabricCostSection";
import TrimsAccessoriesSection from "./TrimsAccessoriesSection";
import OthersSection from "./OthersSection";
import SummarySection from "./SummarySection";

const CostSheetTable = () => {
  const { data, isLoading, error } = useGetCostSheetsQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const renderDynamicTable = (section: any, sectionName: string) => {
    if (!section) return null;
    // If section has rows and columns
    if (Array.isArray(section.rows) && Array.isArray(section.columns)) {
      return (
        <div>
          <div className="font-semibold mb-2">
            {section.tableName || sectionName}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                {section.columns.map((col: string, idx: number) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row: any, idx: number) => (
                <tr key={idx}>
                  {section.columns.map((col: string, cidx: number) => (
                    <td key={cidx}>
                      {row[col.replace(/ \(.+\)/, "").replace(/[^a-zA-Z0-9_]/g, "")] ??
                        row[col] ??
                        row[Object.keys(row)[cidx]] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Show totals if present */}
          {section.total !== undefined && (
            <div className="mt-2 text-right font-semibold">
              Total: {section.total}
            </div>
          )}
          {section.totalValue !== undefined && (
            <div className="mt-2 text-right font-semibold">
              Total Value: {section.totalValue}
            </div>
          )}
          {section.totalWeight !== undefined && (
            <div className="mt-2 text-right font-semibold">
              Total Weight: {section.totalWeight}
            </div>
          )}
          {section.subtotal !== undefined && (
            <div className="mt-2 text-right font-semibold">
              Subtotal: {section.subtotal}
            </div>
          )}
          {section.totalAccessoriesCost !== undefined && (
            <div className="mt-2 text-right font-semibold">
              Total Accessories Cost: {section.totalAccessoriesCost}
            </div>
          )}
          {section.totalFabricCost !== undefined && (
            <div className="mt-2 text-right font-semibold">
              Total Fabric Cost: {section.totalFabricCost}
            </div>
          )}
        </div>
      );
    }
    // If section is an object, show JSON
    return (
      <div>
        <div className="font-semibold mb-2">{sectionName}</div>
        <pre className="bg-muted/10 p-2 rounded">
          {JSON.stringify(section, null, 2)}
        </pre>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-4 w-full ">
        <div className="text-center text-muted-foreground">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 w-full ">
        <div className="text-center text-destructive">
          Failed to load cost sheets.
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4 w-full ">
        <div className="text-center text-muted-foreground">
          No cost sheets found.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 w-full ">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left p-2">Style</th>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">Group</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Fabric Type</th>
              <th className="text-left p-2">GSM</th>
              <th className="text-left p-2">Color</th>
              <th className="text-left p-2">Quantity</th>
              <th className="text-left p-2">Created By</th>
              <th className="text-left p-2">Created At</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sheet: any) => (
              <React.Fragment key={sheet.id}>
                <tr className="border-b hover:bg-muted/20">
                  <td className="p-2">{sheet.style?.name || "-"}</td>
                  <td className="p-2">{sheet.item || "-"}</td>
                  <td className="p-2">{sheet.group || "-"}</td>
                  <td className="p-2">{sheet.size || "-"}</td>
                  <td className="p-2">{sheet.fabricType || "-"}</td>
                  <td className="p-2">{sheet.gsm || "-"}</td>
                  <td className="p-2">{sheet.color || "-"}</td>
                  <td className="p-2">{sheet.quantity ?? "-"}</td>
                  <td className="p-2">{sheet.createdBy?.userName || "-"}</td>
                  <td className="p-2">
                    {sheet.createdAt
                      ? new Date(sheet.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedId(expandedId === sheet.id ? null : sheet.id)
                      }
                    >
                      {expandedId === sheet.id ? "Hide" : "Show"}
                    </Button>
                  </td>
                </tr>
                {expandedId === sheet.id && (
                  <tr>
                    <td colSpan={11} className="bg-muted/10 p-4">
                      <div className=" space-y-6">
                        <CadConsumptionSection
                          data={sheet.cadRows?.rows || []}
                          mode="show"
                        />
                        <FabricCostSection
                          data={sheet.fabricRows}
                          mode="show"
                        />
                        <TrimsAccessoriesSection
                          data={sheet.trimsRows}
                          mode="show"
                        />
                        <OthersSection
                          data={sheet.othersRows}
                          mode="show"
                        />
                        <SummarySection
                          summary={sheet.summaryRows}
                          fabricData={sheet.fabricRows}
                          trimsData={sheet.trimsRows?.rows || []}
                          mode="show"
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CostSheetTable;
