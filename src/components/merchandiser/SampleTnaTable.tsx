import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetTNASummaryQuery } from "@/redux/api/tnaApi";
import { useUpdateCadDesignMutation } from "@/redux/api/cadApi";
import { useUpdateFabricBookingMutation } from "@/redux/api/fabricBooking";
import { useUpdateSampleDevelopmentMutation } from "@/redux/api/sampleDevelopementApi";
import { getStatusBadge, getActualCompleteBadge } from "./SampleTnaBadges";
import { BuyerModal, CadModal, FabricModal, LeadTimeModal, SampleModal } from "./SampleTnaModals";
import { useCreateDHLTrackingMutation } from "@/redux/api/dHLTrackingApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Filter } from "lucide-react";


type SampleTnaTableProps = {
  readOnlyModals?: boolean;
};

const SampleTnaTable = ({ readOnlyModals = false }: SampleTnaTableProps) => {
  const [isBuyerModalVisible, setBuyerModalVisible] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState("");
  const [updateCadDesign, { isLoading: isUpdating }] = useUpdateCadDesignMutation();
  const [updateFabricBooking, { isLoading: isFabricUpdating }] = useUpdateFabricBookingMutation();
  const [updateSampleDevelopment, { isLoading: isSampleUpdating }] = useUpdateSampleDevelopmentMutation();
  const [createDHLTracking, { isLoading: isCreatingDHL }] = useCreateDHLTrackingMutation();

  const [leadTimeModal, setLeadTimeModal] = useState<{
    open: boolean;
    row: any | null;
  }>({
    open: false,
    row: null,
  });
  const [cadModal, setCadModal] = useState<{ open: boolean; cad: any | null }>({
    open: false,
    cad: null,
  });
  const [fabricModal, setFabricModal] = useState<{ open: boolean; fabric: any | null }>({
    open: false,
    fabric: null,
  });
  const [sampleModal, setSampleModal] = useState<{ open: boolean; sample: any | null }>({
    open: false,
    sample: null,
  });
  const [dhlModal, setDhlModal] = useState<{ open: boolean; style: string | null }>({ open: false, style: null });

  const [finalFileReceivedDate, setFinalFileReceivedDate] = useState("");
  const [finalCompleteDate, setFinalCompleteDate] = useState("");
  const [actualBookingDate, setActualBookingDate] = useState("");
  const [actualReceiveDate, setActualReceiveDate] = useState("");
  const [actualSampleReceiveDate, setActualSampleReceiveDate] = useState("");
  const [actualSampleCompleteDate, setActualSampleCompleteDate] = useState("");
  const { data, isLoading } = useGetTNASummaryQuery({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Search state
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Query with search and date range
  const { data: queryData, isLoading: queryLoading } = useGetTNASummaryQuery({
    page,
    pageSize,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const tnaSummary = queryData?.data || [];
  const totalPages = queryData?.totalPages || 1;

  // Reset to first page on search/date change
  useEffect(() => {
    setPage(1);
  }, [search, startDate, endDate]);

  const showBuyerModal = (buyer: string) => {
    setBuyerInfo(buyer);
    setBuyerModalVisible(true);
  };

  const handleBuyerModalClose = () => {
    setBuyerModalVisible(false);
  };

  // When opening CAD modal, set editable fields
  const openCadModal = (cad: any) => {
    setCadModal({ open: true, cad });
    setFinalFileReceivedDate(
      cad?.finalFileReceivedDate
        ? new Date(cad.finalFileReceivedDate).toISOString().slice(0, 10)
        : ""
    );
    setFinalCompleteDate(
      cad?.finalCompleteDate
        ? new Date(cad.finalCompleteDate).toISOString().slice(0, 10)
        : ""
    );
  };

  // When opening Fabric modal, set editable fields
  const openFabricModal = (fabric: any) => {
    setFabricModal({ open: true, fabric });
    setActualBookingDate(
      fabric?.actualBookingDate
        ? new Date(fabric.actualBookingDate).toISOString().slice(0, 10)
        : ""
    );
    setActualReceiveDate(
      fabric?.actualReceiveDate
        ? new Date(fabric.actualReceiveDate).toISOString().slice(0, 10)
        : ""
    );
  };

  // When opening Sample modal, set editable fields
  const openSampleModal = (sample: any) => {
    setSampleModal({ open: true, sample });
    setActualSampleReceiveDate(
      sample?.actualSampleReceiveDate
        ? new Date(sample.actualSampleReceiveDate).toISOString().slice(0, 10)
        : ""
    );
    setActualSampleCompleteDate(
      sample?.actualSampleCompleteDate
        ? new Date(sample.actualSampleCompleteDate).toISOString().slice(0, 10)
        : ""
    );
  };

  // Update handler
  const handleUpdateCad = async () => {
    if (!cadModal.cad) return;
    try {
      await updateCadDesign({
        id: cadModal.cad.id,
        finalFileReceivedDate: finalFileReceivedDate ? new Date(finalFileReceivedDate).toISOString() : null,
        finalCompleteDate: finalCompleteDate ? new Date(finalCompleteDate).toISOString() : null,
      }).unwrap();
      setCadModal({ open: false, cad: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Update handler for Fabric
  const handleUpdateFabric = async () => {
    if (!fabricModal.fabric) return;
    try {
      await updateFabricBooking({
        id: fabricModal.fabric.id,
        actualBookingDate: actualBookingDate ? new Date(actualBookingDate).toISOString() : null,
        actualReceiveDate: actualReceiveDate ? new Date(actualReceiveDate).toISOString() : null,
      }).unwrap();
      setFabricModal({ open: false, fabric: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Update handler for Sample
  const handleUpdateSample = async () => {
    if (!sampleModal.sample) return;
    try {
      await updateSampleDevelopment({
        id: sampleModal.sample.id,
        actualSampleReceiveDate: actualSampleReceiveDate ? new Date(actualSampleReceiveDate).toISOString() : null,
        actualSampleCompleteDate: actualSampleCompleteDate ? new Date(actualSampleCompleteDate).toISOString() : null,
      }).unwrap();
      setSampleModal({ open: false, sample: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  // Add DHL Tracking input state
  const [dhlTrackingInputs, setDhlTrackingInputs] = useState<{ [style: string]: { trackingNumber: string; date: string } }>({});

  // Handler for DHL Tracking input changes
  const handleDHLInputChange = (field: "trackingNumber" | "date", value: string) => {
    if (!dhlModal.style) return;
    setDhlTrackingInputs((prev) => ({
      ...prev,
      [dhlModal.style!]: {
        ...prev[dhlModal.style!],
        [field]: value,
      },
    }));
  };

  // Handler for DHL Tracking create
  const handleCreateDHLTracking = async () => {
    if (!dhlModal.style) return;
    const { trackingNumber, date } = dhlTrackingInputs[dhlModal.style] || {};
    if (!trackingNumber || !date) return;
    try {
      await createDHLTracking({
        style: dhlModal.style,
        trackingNumber,
        date,
        isComplete: true,
      }).unwrap();
      setDhlTrackingInputs((prev) => ({ ...prev, [dhlModal.style!]: { trackingNumber: "", date: "" } }));
      setDhlModal({ open: false, style: null });
    } catch (err) {
      // handle error (toast, etc.)
    }
  };

  return (
    <div className="2xl:max-w-full xl:max-w-[1000px] overflow-x-auto">
      {/* Search Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2 mb-4 items-end">
          <div>
          <label className="block text-xs font-medium mb-1">Search by Name</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Name, Date"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">End Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearch("");
            setStartDate("");
            setEndDate("");
          }}
        >
          Clear
        </Button>
        </div>

         <div className="flex items-center justify-end gap-2">
            
            <Button size="sm">
              <Download className="h-4 w-4 " />
              Export All
            </Button>
          </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Merchandiser</TableHead>
            <TableHead className="text-nowrap">Style</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead className="text-nowrap">Sending Date</TableHead>
            <TableHead>Lead Time</TableHead>
            <TableHead className="text-nowrap">Sample Type</TableHead>
            <TableHead>CAD</TableHead>
            <TableHead>Fabric</TableHead>
            <TableHead>Sample</TableHead>
            <TableHead>DHL Tracking</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(tnaSummary || []).map((row: any) => {
            // CAD
            let cadRemaining = null;
            let cadActualBadge = null;
            if (row.cad && row.cad.completeDate) {
              if (row.cad.finalCompleteDate) {
                // Show actual complete badge (Actual Complete Date - Complete Date)
                const planned = new Date(row.cad.completeDate);
                const actual = new Date(row.cad.finalCompleteDate);
                cadActualBadge = getActualCompleteBadge(actual, planned);
              }
              if (row.cad.finalFileReceivedDate) {
                // Subtract Complete Date - Final File Received Date
                const completeDate = new Date(row.cad.completeDate);
                const finalFileReceivedDate = new Date(row.cad.finalFileReceivedDate);
                cadRemaining = Math.round(
                  (completeDate.getTime() - finalFileReceivedDate.getTime()) /
                  (1000 * 60 * 60 * 24)
                );
              } else {
                // Fallback to original logic (Complete Date - today)
                const completeDate = new Date(row.cad.completeDate);
                const today = new Date();
                cadRemaining = Math.round(
                  (completeDate.getTime() - today.setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24)
                );
              }
            }
            // Lead Time
            let leadTimeRemaining = null;
            if (row.sampleSendingDate) {
              const sampleSendDate = new Date(row.sampleSendingDate);
              const today = new Date();
              leadTimeRemaining = Math.round(
                (sampleSendDate.getTime() - today.setHours(0, 0, 0, 0)) /
                  (1000 * 60 * 60 * 24)
              );
            }
            // Fabric
            let fabricRemaining = null;
            let fabricActualBadge = null;
            if (row.fabricBooking && row.fabricBooking.receiveDate) {
              if (row.fabricBooking.actualReceiveDate) {
                // Show actual complete badge (Actual Receive Date - Planned Receive Date)
                const planned = new Date(row.fabricBooking.receiveDate);
                const actual = new Date(row.fabricBooking.actualReceiveDate);
                fabricActualBadge = getActualCompleteBadge(actual, planned);
              }
              if (row.fabricBooking.actualBookingDate) {
                // Subtract Receive Date - Actual Booking Date
                const receiveDate = new Date(row.fabricBooking.receiveDate);
                const actualBookingDate = new Date(row.fabricBooking.actualBookingDate);
                fabricRemaining = Math.round(
                  (receiveDate.getTime() - actualBookingDate.getTime()) / (1000 * 60 * 60 * 24)
                );
              } else {
                // Fallback to original logic (Receive Date - today)
                const receiveDate = new Date(row.fabricBooking.receiveDate);
                const today = new Date();
                fabricRemaining = Math.round(
                  (receiveDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
                );
              }
            }

            // Sample
            let sampleRemaining = null;
            let sampleActualBadge = null;
            if (row.sampleDevelopment && row.sampleDevelopment.sampleCompleteDate) {
              if (row.sampleDevelopment.actualSampleCompleteDate) {
                // Show actual complete badge (Actual Complete Date - Planned Complete Date)
                const planned = new Date(row.sampleDevelopment.sampleCompleteDate);
                const actual = new Date(row.sampleDevelopment.actualSampleCompleteDate);
                sampleActualBadge = getActualCompleteBadge(actual, planned);
              }
              if (row.sampleDevelopment.actualSampleReceiveDate) {
                // Subtract Complete Date - Actual Receive Date
                const completeDate = new Date(row.sampleDevelopment.sampleCompleteDate);
                const actualReceiveDate = new Date(row.sampleDevelopment.actualSampleReceiveDate);
                sampleRemaining = Math.round(
                  (completeDate.getTime() - actualReceiveDate.getTime()) / (1000 * 60 * 60 * 24)
                );
              } else {
                // Fallback to original logic (Complete Date - today)
                const completeDate = new Date(row.sampleDevelopment.sampleCompleteDate);
                const today = new Date();
                sampleRemaining = Math.round(
                  (completeDate.getTime() - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
                );
              }
            }

            return (
              <TableRow key={row.id}>
                <TableCell>{row.merchandiser || ""}</TableCell>
                <TableCell className="text-nowrap">{row.style || ""}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => showBuyerModal(row.buyerName || "")}
                  >
                    {row.buyerName || ""}
                  </Button>
                </TableCell>
                <TableCell>
                  {row.sampleSendingDate
                    ? new Date(row.sampleSendingDate).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>
                  {leadTimeRemaining !== null
                    ? (
                        <Button
                          variant="link"
                          onClick={() => setLeadTimeModal({ open: true, row })}
                        >
                          {getStatusBadge(leadTimeRemaining)}
                        </Button>
                      )
                    : ""}
                </TableCell>
                <TableCell>{row.sampleType || ""}</TableCell>
                <TableCell>
                  {row.cad ? (
                    <Button
                      variant="link"
                      onClick={() => openCadModal(row.cad)}
                    >
                      {cadActualBadge ? cadActualBadge : getStatusBadge(cadRemaining)}
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  {row.fabricBooking ? (
                    <Button
                      variant="link"
                      onClick={() => openFabricModal(row.fabricBooking)}
                    >
                      {fabricActualBadge ? fabricActualBadge : getStatusBadge(fabricRemaining)}
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  {row.sampleDevelopment ? (
                    <Button
                      variant="link"
                      onClick={() => openSampleModal(row.sampleDevelopment)}
                    >
                      {sampleActualBadge ? sampleActualBadge : getStatusBadge(sampleRemaining)}
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  {row.dhlTracking ? (
                    <div>
                      {/* <div>
                        <span className="font-semibold">No:</span> {row.dhlTracking.trackingNumber}
                      </div>
                      <div>
                        <span className="font-semibold">Date:</span> {row.dhlTracking.date ? new Date(row.dhlTracking.date).toLocaleDateString() : ""}
                      </div> */}
                      <div className=" text-nowrap">
                        <span className="font-semibold">Complete:</span> {row.dhlTracking.isComplete ? "Yes" : "No"}
                      </div>
                    </div>
                  ) : (
                    !readOnlyModals && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDhlModal({ open: true, style: row.style })}
                      >
                        Add DHL Tracking
                      </Button>
                    )
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Prev
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
      {/* Buyer Modal */}
      <BuyerModal
        visible={isBuyerModalVisible}
        onClose={handleBuyerModalClose}
        buyerInfo={buyerInfo}
      />
      {/* Lead Time Modal */}
      <LeadTimeModal
        open={leadTimeModal.open}
        onOpenChange={(open) =>
          setLeadTimeModal({ open, row: open ? leadTimeModal.row : null })
        }
        row={leadTimeModal.row}
      />
      {/* CAD Modal */}
      <CadModal
        open={cadModal.open}
        onOpenChange={(open) =>
          setCadModal({ open, cad: open ? cadModal.cad : null })
        }
        cad={cadModal.cad}
        finalFileReceivedDate={finalFileReceivedDate}
        setFinalFileReceivedDate={setFinalFileReceivedDate}
        finalCompleteDate={finalCompleteDate}
        setFinalCompleteDate={setFinalCompleteDate}
        onUpdate={handleUpdateCad}
        isUpdating={isUpdating}
        readOnly={readOnlyModals}
      />
      {/* Fabric Modal */}
      <FabricModal
        open={fabricModal.open}
        onOpenChange={(open) =>
          setFabricModal({ open, fabric: open ? fabricModal.fabric : null })
        }
        fabric={fabricModal.fabric}
        actualBookingDate={actualBookingDate}
        setActualBookingDate={setActualBookingDate}
        actualReceiveDate={actualReceiveDate}
        setActualReceiveDate={setActualReceiveDate}
        onUpdate={handleUpdateFabric}
        isUpdating={isFabricUpdating}
        readOnly={readOnlyModals}
      />
      {/* Sample Development Modal */}
      <SampleModal
        open={sampleModal.open}
        onOpenChange={(open) =>
          setSampleModal({ open, sample: open ? sampleModal.sample : null })
        }
        sample={sampleModal.sample}
        actualSampleReceiveDate={actualSampleReceiveDate}
        setActualSampleReceiveDate={setActualSampleReceiveDate}
        actualSampleCompleteDate={actualSampleCompleteDate}
        setActualSampleCompleteDate={setActualSampleCompleteDate}
        onUpdate={handleUpdateSample}
        isUpdating={isSampleUpdating}
        readOnly={readOnlyModals}
      />
      {/* DHL Tracking Modal */}
      <Dialog open={dhlModal.open} onOpenChange={open => setDhlModal(open ? dhlModal : { open: false, style: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add DHL Tracking</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Tracking Number"
              className="border rounded px-2 py-1"
              value={dhlTrackingInputs[dhlModal.style || ""]?.trackingNumber || ""}
              onChange={e => handleDHLInputChange("trackingNumber", e.target.value)}
            />
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={dhlTrackingInputs[dhlModal.style || ""]?.date || ""}
              onChange={e => handleDHLInputChange("date", e.target.value)}
            />
            <Button
              size="sm"
              onClick={handleCreateDHLTracking}
              disabled={
                !dhlTrackingInputs[dhlModal.style || ""]?.trackingNumber ||
                !dhlTrackingInputs[dhlModal.style || ""]?.date ||
                isCreatingDHL
              }
            >
              {isCreatingDHL ? "Saving..." : "Complete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleTnaTable;
