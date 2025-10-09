import React, { useState } from "react";
import { Card } from "../ui/card";
import { useGetCostSheetsQuery } from "@/redux/api/costSheetApi";
import { Button } from "@/components/ui/button";

const CostSheetTable = () => {
  const { data, isLoading, error } = useGetCostSheetsQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
        <div className="text-center text-destructive">Failed to load cost sheets.</div>
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
              <th className="text-left p-2">Created By</th>
              <th className="text-left p-2">Created At</th>
              <th className="text-left p-2">Total Cost</th>
              <th className="text-left p-2">FOB Price</th>
              <th className="text-left p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sheet: any) => (
              <React.Fragment key={sheet.id}>
                <tr className="border-b hover:bg-muted/20">
                  <td className="p-2">{sheet.style?.name || "-"}</td>
                  <td className="p-2">{sheet.createdBy?.userName || "-"}</td>
                  <td className="p-2">
                    {sheet.createdAt
                      ? new Date(sheet.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">
                    ${sheet.totalCost ? Number(sheet.totalCost).toFixed(2) : "0.00"}
                  </td>
                  <td className="p-2">
                    ${sheet.fobPrice ? Number(sheet.fobPrice).toFixed(2) : "0.00"}
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
                    <td colSpan={6} className="bg-muted/10 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CAD Consumption */}
                        <div>
                          <div className="font-semibold mb-2">CAD Consumption</div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th>Field</th>
                                <th>Weight</th>
                                <th>%</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(sheet.cadRows || []).map((row: any) => (
                                <tr key={row.id}>
                                  <td>{row.fieldName}</td>
                                  <td>{row.weight ?? ""}</td>
                                  <td>{row.percent ?? ""}</td>
                                  <td>{row.value ?? 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Fabric Cost */}
                        <div>
                          <div className="font-semibold mb-2">Fabric Cost</div>
                          {sheet.fabricRows && (
                            <table className="w-full text-sm">
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Field</th>
                                  <th>Unit</th>
                                  <th>Rate</th>
                                  <th>Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Yarn */}
                                {(sheet.fabricRows.yarnRows || []).map((row: any) => (
                                  <tr key={row.id}>
                                    <td>yarn</td>
                                    <td>{row.fieldName}</td>
                                    <td>{row.unit ?? ""}</td>
                                    <td>{row.rate ?? ""}</td>
                                    <td>{row.value ?? 0}</td>
                                  </tr>
                                ))}
                                {/* Knitting */}
                                {(sheet.fabricRows.knittingRows || []).map((row: any) => (
                                  <tr key={row.id}>
                                    <td>knitting</td>
                                    <td>{row.fieldName}</td>
                                    <td>{row.unit ?? ""}</td>
                                    <td>{row.rate ?? ""}</td>
                                    <td>{row.value ?? 0}</td>
                                  </tr>
                                ))}
                                {/* Dyeing */}
                                {(sheet.fabricRows.dyeingRows || []).map((row: any) => (
                                  <tr key={row.id}>
                                    <td>dyeing</td>
                                    <td>{row.fieldName}</td>
                                    <td>{row.unit ?? ""}</td>
                                    <td>{row.rate ?? ""}</td>
                                    <td>{row.value ?? 0}</td>
                                  </tr>
                                ))}
                                {/* Print & Embellishment */}
                                {(sheet.fabricRows.printEmbRows || []).map((row: any) => (
                                  <tr key={row.id}>
                                    <td>printEmb</td>
                                    <td>{row.fieldName}</td>
                                    <td>{row.unit ?? ""}</td>
                                    <td>{row.rate ?? ""}</td>
                                    <td>{row.value ?? 0}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                        {/* Trims & Accessories */}
                        <div>
                          <div className="font-semibold mb-2">Trims & Accessories</div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th>Description</th>
                                <th>Cost</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(sheet.trimsRows || []).map((row: any) => (
                                <tr key={row.id}>
                                  <td>{row.description}</td>
                                  <td>{row.cost ?? ""}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Others */}
                        <div>
                          <div className="font-semibold mb-2">Others</div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr>
                                <th>Label</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(sheet.othersRows || []).map((row: any) => (
                                <tr key={row.id}>
                                  <td>{row.label}</td>
                                  <td>{row.value ?? ""}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
