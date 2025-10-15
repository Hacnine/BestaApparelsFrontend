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
import { Circle, CircleX, Copy, Edit, Printer } from "lucide-react";
import { useForm } from "react-hook-form";

// Add a simple fullscreen modal component
const FullScreenModal = ({
  open,
  onClose,
  children,
  onPrint,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onPrint?: () => void;
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      style={{ animation: "fadeIn 0.2s" }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="bg-white rounded-lg shadow-lg w-[90vw] h-[90vh] overflow-y-auto p-8 relative flex flex-col"
          id="costsheet-modal-content"
        >
          <div className="absolute top-1 right-1 flex gap-2 print-hide">
            <button
              className="px-2 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={onPrint}
            >
              <Printer className=" size-4" />
            </button>
            <button
              className="px-2 py-1 text-sm rounded-md bg-red-600 text-white rounded hover:bg-red-700"
              onClick={onClose}
            >
              <CircleX className=" size-4" />
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto print:overflow-visible print:p-0"
            id="costsheet-print-area"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const CostSheetTable = () => {
  const { data, isLoading, error } = useGetCostSheetsQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editModalId, setEditModalId] = useState<number | null>(null);
  const [updateCostSheet, { isLoading: isUpdating }] =
    useUpdateCostSheetMutation();

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
      const sheet = data.find((s: any) => s.id === expandedId);
      setEditedCadRows(sheet?.cadRows);
      setEditedFabricRows(sheet?.fabricRows);
      setEditedTrimsRows(sheet?.trimsRows);
      setEditedOthersRows(sheet?.othersRows);
      setEditedSummaryRows(sheet?.summaryRows);
      
    }
  }, [expandedId, data]);

  // Print handler: prints only the modal content
  const handlePrint = () => {
    const printArea = document.getElementById("costsheet-print-area");
    if (!printArea) return;

    // Get all stylesheets from the document
    let styles = "";
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach((rule) => {
            styles += rule.cssText;
          });
        }
      } catch (e) {
        // Ignore CORS errors for external stylesheets
      }
    });

    // Print-specific styles for Excel-like table
    styles += `
      @media print {
        body { background: white !important; }
        .print-hide { display: none !important; }
        .print\\:overflow-visible { overflow: visible !important; }
        .print\\:p-0 { padding: 0 !important; }
        .bg-black.bg-opacity-70 { background: none !important; }
        .shadow-lg, .rounded-lg { box-shadow: none !important; border-radius: 0 !important; }
        .w-\\[90vw\\],.h-\\[90vh\\] { width: 100vw !important; height: auto !important; }
        .p-8 { padding: 0 !important; }
        /* Excel-like table styles */
        table { border-collapse: collapse !important; width: 100% !important; font-size: 12px !important; }
        th, td { border: 1px solid #222 !important; padding: 2px 6px !important; text-align: left !important; background: white !important; }
        th { background: #eaeaea !important; font-weight: bold !important; }
        tr { background: white !important; }
        .bg-muted\\/10, .bg-muted\\/20, .bg-muted\\/30 { background: white !important; }
        .text-primary { color: #000 !important; }
        .font-semibold { font-weight: bold !important; }
        .text-lg, .text-sm { font-size: 12px !important; }
        .border-b { border-bottom: 1px solid #222 !important; }
        .border-t-2 { border-top: 2px solid #222 !important; }
        .separator { border-top: 1px solid #222 !important; }
        /* Remove card styles */
        .card, .Card { box-shadow: none !important; border: none !important; background: none !important; }
        input, .border-none {
          border: none !important;
          box-shadow: none !important;
        }
      }
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Cost Sheet</title>
          <style>${styles}</style>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css">
        </head>
        <body>
          <div>
            ${printArea.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

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
    expandedId !== null ? data?.find((s: any) => s.id === expandedId) : null;
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
  } else if (!data || data.length === 0) {
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

                {/* <th className="text-left p-2">Download</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((sheet: any) => (
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
                    <td className="p-2 text-sm">{sheet.createdBy?.userName || "-"}</td>
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
                    {/* <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportRow(sheet)}
                        title="Download all data as separate Excel sheets"
                      >
                        Download
                      </Button>
                    </td> */}
                  </tr>
                  {/* Remove inline expanded row */}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Fullscreen modal for expanded details */}
        <FullScreenModal
          open={expandedId !== null}
          onClose={() => {
            setExpandedId(null);
            setEditModalId(null);
          }}
          onPrint={handlePrint}
        >
          {expandedId !== null && sheet && (
            <div className="space-y-5">
              {/* Modal header actions */}
              <div className="flex justify-end gap-2 mb-2 print-hide">
                {isEditMode ? (
                  <Button
                    variant="default"
                    size="sm"
                    disabled={isUpdating}
                    onClick={async () => {
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
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Save
                  </Button>
                ) : null}
              </div>
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
                    data={editedCadRows?.rows || []}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedCadRows(d) : undefined
                    }
                  />
                  <FabricCostSection
                    data={
                      isEditMode
                        ? editedFabricRows
                        : sheet.fabricRows?.json || sheet.fabricRows
                    }
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedFabricRows(d) : undefined
                    }
                  />
                  <OthersSection
                    data={editedOthersRows}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedOthersRows(d) : undefined
                    }
                  />
                </div>
                <div className="w-1/2 space-y-5">
                  <TrimsAccessoriesSection
                    data={editedTrimsRows}
                    mode={isEditMode ? "edit" : "show"}
                    onChange={
                      isEditMode ? (d) => setEditedTrimsRows(d) : undefined
                    }
                  />
                </div>
              </div>
              <SummarySection
                summary={editedSummaryRows}
                fabricData={editedFabricRows}
                trimsData={editedTrimsRows?.rows || []}
                othersData={editedOthersRows?.rows || []}
                mode={isEditMode ? "edit" : "show"}
                onChange={
                  isEditMode ? (d) => setEditedSummaryRows(d) : undefined
                }
              />
            </div>
          )}
        </FullScreenModal>
      </Card>
    );
  }

  return content;
};

export default CostSheetTable;
