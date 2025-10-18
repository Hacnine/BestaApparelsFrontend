import React, { useState, useRef } from "react";
import { Card } from "../ui/card";
import {
  useGetCostSheetsQuery,
  useUpdateCostSheetMutation,
} from "@/redux/api/costSheetApi";
import { Button } from "@/components/ui/button";
import CadConsumptionSection from "./CadConsumptionSection";
import FabricCostSection from "./FabricCostSection";
import TrimsAccessoriesSection from "./TrimsAccessoriesSection";
import OthersSection from "./OthersSection";
import SummarySection from "./SummarySection";
import {
  exportCompleteRowData,
  exportMultipleSheets,
} from "@/utils/exportUtils";
import StyleInfoForm from "./StyleInfoForm";
import { Copy, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import FullScreenModal from "./FullScreenModal";

const CostSheetTable = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;
  // API call with pagination
  const { data, isLoading, error } = useGetCostSheetsQuery({ page, limit });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editModalId, setEditModalId] = useState<number | null>(null);
  const [updateCostSheet, { isLoading: isUpdating }] = useUpdateCostSheetMutation();
  //console.log(data)
  // Add a form instance for edit mode
  const editForm = useForm({
    defaultValues: {
      style: "",
      item: "",
      group: "",
      size: "",
      fabricType: "",
      gsm: "",
      color: "",
      qty: "",
    },
  });

  // Store edited data for save (optional, for real save logic)
  const editedDataRef = useRef<any>(null);

  // Local state for edited sections
  const [editedCadRows, setEditedCadRows] = useState<any>(null);
  const [editedFabricRows, setEditedFabricRows] = useState<any>(null);
  const [editedTrimsRows, setEditedTrimsRows] = useState<any>(null);
  const [editedOthersRows, setEditedOthersRows] = useState<any>(null);
  const [editedSummaryRows, setEditedSummaryRows] = useState<any>(null);

  // Reset edited section state when opening a new modal
  React.useEffect(() => {
    if (expandedId !== null) {
      const sheet = data?.sanitized?.find((s: any) => s.id === expandedId);
      setEditedCadRows(sheet?.cadRows);
      setEditedFabricRows(sheet?.fabricRows?.json || sheet?.fabricRows?.rows || sheet?.fabricRows);
      setEditedTrimsRows(sheet?.trimsRows);
      setEditedOthersRows(sheet?.othersRows);
      setEditedSummaryRows(sheet?.summaryRows?.json || sheet?.summaryRows?.summary || sheet?.summaryRows);
    }
  }, [expandedId, data]);

  // Replace the existing handleExportRow function with this comprehensive version
  const handleExportRow = (sheet: any) => {
    exportCompleteRowData(sheet);
  };

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
                      {row[
                        col.replace(/ \(.+\)/, "").replace(/[^a-zA-Z0-9_]/g, "")
                      ] ??
                        row[col] ??
                        row[Object.keys(row)[cidx]] ??
                        ""}
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

  // Find the sheet and edit mode before rendering
  const sheet =
    expandedId !== null ? data?.sanitized?.find((s: any) => s.id === expandedId) : null;
  const isEditMode = sheet && editModalId === sheet.id;

  // Set form values when entering edit mode
  React.useEffect(() => {
    if (isEditMode && sheet && editForm) {
      editForm.reset({
        style: sheet.style?.name || sheet.style || "",
        item: sheet.item || "",
        group: sheet.group || "",
        size: sheet.size || "",
        fabricType: sheet.fabricType || "",
        gsm: sheet.gsm || "",
        color: sheet.color || "",
        qty: sheet.quantity ?? "",
      });
    }
  }, [isEditMode, sheet, editForm]);

  // Render logic
  let content;
  if (isLoading) {
    content = (
      <Card className="p-4 w-full ">
        <div className="text-center text-muted-foreground">Loading...</div>
      </Card>
    );
  } else if (error) {
    content = (
      <Card className="p-4 w-full ">
        <div className="text-center text-destructive">
          Failed to load cost sheets.
        </div>
      </Card>
    );
  } else if (!data || !data.sanitized || data.sanitized.length === 0) {
    content = (
      <Card className="p-4 w-full ">
        <div className="text-center text-muted-foreground">
          No cost sheets found.
        </div>
      </Card>
    );
  } else {
    content = (
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
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.sanitized.map((sheet: any) => (
                <React.Fragment key={sheet.id}>
                  <tr className="border-b hover:bg-muted/20">
                    <td className="p-2 uppercase text-xs">
                      {sheet.style?.name || "-"}
                    </td>
                    <td className="p-2 text-sm">{sheet.item || "-"}</td>
                    <td className="p-2 text-sm">{sheet.group || "-"}</td>
                    <td className="p-2 text-sm">{sheet.size || "-"}</td>
                    <td className="p-2 text-sm">{sheet.fabricType || "-"}</td>
                    <td className="p-2 text-sm">{sheet.gsm || "-"}</td>
                    <td className="p-2 text-sm">{sheet.color || "-"}</td>
                    <td className="p-2 text-sm">{sheet.quantity ?? "-"}</td>
                    <td className="p-2 text-sm">
                      {sheet.createdBy?.userName || "-"}
                    </td>
                    <td className="p-2 text-sm">
                      {sheet.createdAt
                        ? new Date(sheet.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpandedId(
                            expandedId === sheet.id ? null : sheet.id
                          )
                        }
                      >
                        {expandedId === sheet.id ? "Hide" : "Show"}
                      </Button>
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setExpandedId(sheet.id);
                          setEditModalId(sheet.id);
                        }}
                        title="Edit Cost Sheet"
                        className=" text-blue-600 hover:text-white"
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handleExportRow(sheet)}
                        title="Copy Cost Sheet"
                        className="-ml-3  text-yellow-600 hover:text-white"
                      >
                        <Copy />
                      </Button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-2">Page {page} of {data.totalPages || 1}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={!data.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
        {/* Fullscreen modal for expanded details */}
        <FullScreenModal
          open={expandedId !== null}
          onClose={() => {
            setExpandedId(null);
            setEditModalId(null);
          }}
          isEditMode={isEditMode}
          isUpdating={isUpdating}
          onSave={async () => {
            const editedValues = editForm.getValues();
            const payload = {
              id: sheet.id,
              data: {
                style: editedValues.style,
                item: editedValues.item,
                group: editedValues.group,
                size: editedValues.size,
                fabricType: editedValues.fabricType,
                gsm: editedValues.gsm,
                color: editedValues.color,
                quantity: editedValues.qty,
                cadRows: editedCadRows,
                fabricRows: editedFabricRows,
                trimsRows: editedTrimsRows,
                othersRows: editedOthersRows,
                summaryRows: editedSummaryRows,
              },
            };
            try {
              await updateCostSheet(payload).unwrap();
              setEditModalId(null);
            } catch (err) {
              // Optionally handle error
            }
          }}
        >
          {expandedId !== null && sheet && (
            <div className="space-y-5">
              <StyleInfoForm
                mode={isEditMode ? "edit" : "show"}
                data={{
                  style: sheet.style?.name || sheet.style || "-",
                  item: sheet.item,
                  group: sheet.group,
                  size: sheet.size,
                  fabricType: sheet.fabricType,
                  gsm: sheet.gsm,
                  color: sheet.color,
                  qty: sheet.quantity ?? "-",
                }}
                form={isEditMode ? editForm : undefined}
              />
              <div className="flex gap-6 ">
                <div className="w-1/2 space-y-6 ">
                  <CadConsumptionSection
                    data={isEditMode 
                      ? editedCadRows?.rows || [] 
                      : sheet?.cadRows?.rows || sheet?.cadRows?.json?.rows || []}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedCadRows(d) : undefined
                    }
                  />
                  <FabricCostSection
                    data={isEditMode 
                      ? editedFabricRows 
                      : sheet?.fabricRows?.json || sheet?.fabricRows?.rows || sheet?.fabricRows}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedFabricRows(d) : undefined
                    }
                  />
                  <OthersSection
                    data={isEditMode 
                      ? editedOthersRows
                      : sheet?.othersRows}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedOthersRows(d) : undefined
                    }
                  />
                </div>
                <div className="w-1/2 space-y-5">
                  <TrimsAccessoriesSection
                    data={isEditMode 
                      ? editedTrimsRows
                      : sheet?.trimsRows}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedTrimsRows(d) : undefined
                    }
                  />

                  <SummarySection
                    summary={isEditMode 
                      ? editedSummaryRows?.summary || editedSummaryRows
                      : sheet?.summaryRows?.summary || sheet?.summaryRows?.json?.summary || sheet?.summaryRows}
                    fabricData={isEditMode 
                      ? editedFabricRows 
                      : sheet?.fabricRows?.json || sheet?.fabricRows?.rows || sheet?.fabricRows}
                    trimsData={isEditMode 
                      ? editedTrimsRows?.rows || []
                      : sheet?.trimsRows?.rows || []}
                    othersData={isEditMode 
                      ? editedOthersRows?.rows || editedOthersRows?.json || []
                      : sheet?.othersRows?.rows || []}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedSummaryRows(d) : undefined
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </FullScreenModal>
      </Card>
    );
  }

  return content;
};

export default CostSheetTable;
