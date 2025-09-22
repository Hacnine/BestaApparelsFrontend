import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTNASummaryQuery } from "@/redux/api/tnaApi";
import { useUpdateCadDesignMutation } from "@/redux/api/cadApi";
import { useUpdateFabricBookingMutation } from "@/redux/api/fabricBooking";
import { useUpdateSampleDevelopmentMutation } from "@/redux/api/sampleDevelopementApi";
import { cn } from "@/lib/utils"; // If you use a classnames util, otherwise use template strings

// Show "+N" for days left, "-N" for overdue, "0" for due today
const getStatusBadge = (remaining: number | null) => {
  if (remaining === null) return null;
  if (remaining > 0) {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
        +{remaining} days
      </span>
    );
  } else if (remaining === 0) {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-medium">
        0 days
      </span>
    );
  } else {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 font-medium">
        -{Math.abs(remaining)} days
      </span>
    );
  }
};

// Show blue badge for actual completion: "+N" if on/before, "-N" if exceeded
const getActualCompleteBadge = (actual: Date, planned: Date) => {
  const diff = Math.round((actual.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
        {Math.abs(diff)} days
      </span>
    );
  } else {
    return (
      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
        -{diff} days
      </span>
    );
  }
};

const SampleTnaTable = () => {
  const [isBuyerModalVisible, setBuyerModalVisible] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState("");
  const [updateCadDesign, { isLoading: isUpdating }] = useUpdateCadDesignMutation();
  const [updateFabricBooking, { isLoading: isFabricUpdating }] = useUpdateFabricBookingMutation();
  const [updateSampleDevelopment, { isLoading: isSampleUpdating }] = useUpdateSampleDevelopmentMutation();

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
  const [finalFileReceivedDate, setFinalFileReceivedDate] = useState("");
  const [finalCompleteDate, setFinalCompleteDate] = useState("");
  const [actualBookingDate, setActualBookingDate] = useState("");
  const [actualReceiveDate, setActualReceiveDate] = useState("");
  const [actualSampleReceiveDate, setActualSampleReceiveDate] = useState("");
  const [actualSampleCompleteDate, setActualSampleCompleteDate] = useState("");
  const { data: tnaSummary } = useGetTNASummaryQuery({});
  console.log("TNA Summary:", tnaSummary);
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

  return (
    <div className=" 2xl:max-w-full xl:max-w-[900px] overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Merchandiser</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Sending Date</TableHead>
            <TableHead>Lead Time</TableHead>
            <TableHead>Sample Type</TableHead>
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
                <TableCell>{row.style || ""}</TableCell>
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
                <TableCell>{/* DHL Tracking empty */}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* Buyer Modal */}
      <Dialog open={isBuyerModalVisible} onOpenChange={setBuyerModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buyer Info</DialogTitle>
          </DialogHeader>
          <div>{buyerInfo}</div>
          <Button onClick={() => setBuyerModalVisible(false)}>OK</Button>
        </DialogContent>
      </Dialog>
      {/* Lead Time Modal */}
      <Dialog
        open={leadTimeModal.open}
        onOpenChange={(open) =>
          setLeadTimeModal({ open, row: open ? leadTimeModal.row : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead Time Details</DialogTitle>
          </DialogHeader>
          {leadTimeModal.row && (
            <div className="space-y-2">
              <div>
                <strong>Order Date:</strong>{" "}
                {leadTimeModal.row.orderDate
                  ? new Date(leadTimeModal.row.orderDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <strong>Sample Sending Date:</strong>{" "}
                {leadTimeModal.row.sampleSendingDate
                  ? new Date(leadTimeModal.row.sampleSendingDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <strong>Lead Time:</strong>{" "}
                {leadTimeModal.row.sampleSendingDate &&
                leadTimeModal.row.orderDate
                  ? Math.round(
                      (new Date(leadTimeModal.row.sampleSendingDate).getTime() -
                        new Date(leadTimeModal.row.orderDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : ""}{" "}
                days
              </div>
              <div>
                <strong>
                  {leadTimeModal.row.sampleSendingDate
                    ? (() => {
                        const today = new Date();
                        const sampleSendDate = new Date(leadTimeModal.row.sampleSendingDate);
                        const remaining = Math.round(
                          (sampleSendDate.getTime() - today.setHours(0, 0, 0, 0)) /
                            (1000 * 60 * 60 * 24)
                        );
                        return remaining >= 0
                          ? `${remaining} days remaining`
                          : `${Math.abs(remaining)} days overdue`;
                    })()
                    : ""}
                </strong>
              </div>
            </div>
          )}
          <Button
            onClick={() => setLeadTimeModal({ open: false, row: null })}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
      {/* CAD Modal */}
      <Dialog
        open={cadModal.open}
        onOpenChange={(open) =>
          setCadModal({ open, cad: open ? cadModal.cad : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CAD Details</DialogTitle>
          </DialogHeader>
          {cadModal.cad && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Style:</strong> {cadModal.cad.style}
              </div>
              <div>
                <strong>CAD Master Name:</strong> {cadModal.cad.CadMasterName}
              </div>
              <div>
                <strong>File Receive Date:</strong>{" "}
                {cadModal.cad.fileReceiveDate
                  ? new Date(cadModal.cad.fileReceiveDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <strong>Complete Date:</strong>{" "}
                {cadModal.cad.completeDate
                  ? new Date(cadModal.cad.completeDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <label className="block text-sm font-medium">Actual File Received Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={finalFileReceivedDate}
                  onChange={e => setFinalFileReceivedDate(e.target.value)}
                />
                {/* Show current value if available */}
                {cadModal.cad.finalFileReceivedDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {new Date(cadModal.cad.finalFileReceivedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Actual Complete Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={finalCompleteDate}
                  onChange={e => setFinalCompleteDate(e.target.value)}
                />
                {/* Show current value if available */}
                {cadModal.cad.finalCompleteDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {new Date(cadModal.cad.finalCompleteDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="col-span-2 flex justify-end">
                <Button
                  onClick={handleUpdateCad}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Fabric Modal */}
      <Dialog
        open={fabricModal.open}
        onOpenChange={(open) =>
          setFabricModal({ open, fabric: open ? fabricModal.fabric : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fabric Booking Details</DialogTitle>
          </DialogHeader>
          {fabricModal.fabric && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Style:</strong> {fabricModal.fabric.style}
              </div>
              <div>
                <strong>Days Between:</strong>{" "}
                {fabricModal.fabric.bookingDate && fabricModal.fabric.receiveDate
                  ? Math.round(
                      (new Date(fabricModal.fabric.receiveDate).getTime() -
                        new Date(fabricModal.fabric.bookingDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : ""}
              </div>
              <div>
                <strong>Booking Date:</strong>{" "}
                {fabricModal.fabric.bookingDate
                  ? new Date(fabricModal.fabric.bookingDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <strong>Receive Date:</strong>{" "}
                {fabricModal.fabric.receiveDate
                  ? new Date(fabricModal.fabric.receiveDate).toLocaleDateString()
                  : ""}
              </div>
              
              <div>
                <label className="block text-sm font-medium">Actual Booking Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={actualBookingDate}
                  onChange={e => setActualBookingDate(e.target.value)}
                />
                {fabricModal.fabric.actualBookingDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {new Date(fabricModal.fabric.actualBookingDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Actual Receive Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={actualReceiveDate}
                  onChange={e => setActualReceiveDate(e.target.value)}
                />
                {fabricModal.fabric.actualReceiveDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {new Date(fabricModal.fabric.actualReceiveDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="col-span-2 flex justify-end">
                <Button
                  onClick={handleUpdateFabric}
                  disabled={isFabricUpdating}
                >
                  {isFabricUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Sample Development Modal */}
      <Dialog
        open={sampleModal.open}
        onOpenChange={(open) =>
          setSampleModal({ open, sample: open ? sampleModal.sample : null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sample Development Details</DialogTitle>
          </DialogHeader>
          {sampleModal.sample && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Style:</strong> {sampleModal.sample.style}
              </div>
              <div>
                <strong>Sampleman Name:</strong> {sampleModal.sample.samplemanName}
              </div>
              <div>
                <strong>Sample Receive Date:</strong>{" "}
                {sampleModal.sample.sampleReceiveDate
                  ? new Date(sampleModal.sample.sampleReceiveDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <strong>Sample Complete Date:</strong>{" "}
                {sampleModal.sample.sampleCompleteDate
                  ? new Date(sampleModal.sample.sampleCompleteDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                <strong>Sample Quantity:</strong> {sampleModal.sample.sampleQuantity}
              </div>
              <div>
                <strong>Days Between:</strong>{" "}
                {sampleModal.sample.sampleReceiveDate && sampleModal.sample.sampleCompleteDate
                  ? Math.round(
                      (new Date(sampleModal.sample.sampleCompleteDate).getTime() -
                        new Date(sampleModal.sample.sampleReceiveDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : ""}
              </div>
              <div>
                <label className="block text-sm font-medium">Actual Sample Receive Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={actualSampleReceiveDate}
                  onChange={e => setActualSampleReceiveDate(e.target.value)}
                />
                {sampleModal.sample.actualSampleReceiveDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {new Date(sampleModal.sample.actualSampleReceiveDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Actual Sample Complete Date</label>
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={actualSampleCompleteDate}
                  onChange={e => setActualSampleCompleteDate(e.target.value)}
                />
                {sampleModal.sample.actualSampleCompleteDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {new Date(sampleModal.sample.actualSampleCompleteDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="col-span-2 flex justify-end">
                <Button
                  onClick={handleUpdateSample}
                  disabled={isSampleUpdating}
                >
                  {isSampleUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleTnaTable;
