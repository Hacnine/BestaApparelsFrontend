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

const SampleTnaTable = () => {
  const [isBuyerModalVisible, setBuyerModalVisible] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState("");
  const [leadTimeModal, setLeadTimeModal] = useState<{
    open: boolean;
    row: any | null;
  }>({
    open: false,
    row: null,
  });
  const { data: tnaSummary } = useGetTNASummaryQuery({});
  console.log("TNA Summary:", tnaSummary);
  const showBuyerModal = (buyer: string) => {
    setBuyerInfo(buyer);
    setBuyerModalVisible(true);
  };

  const handleBuyerModalClose = () => {
    setBuyerModalVisible(false);
  };

  return (
    <div>
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
            const leadTime =
              row.sampleSendingDate && row.orderDate
                ? Math.round(
                    (new Date(row.sampleSendingDate).getTime() -
                      new Date(row.orderDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : null;
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
                  {leadTime !== null ? (
                    <>
                      <Button
                        variant="link"
                        onClick={() => setLeadTimeModal({ open: true, row })}
                      >
                        {leadTime} days
                      </Button>
                    </>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>{row.sampleType || ""}</TableCell>
                <TableCell>
                  {row.cadCompleteDate
                    ? new Date(row.cadCompleteDate).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>{/* Fabric empty */}</TableCell>
                <TableCell>{/* Sample empty */}</TableCell>
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
            <div>
              <div>
                Order Date:{" "}
                {leadTimeModal.row.orderDate
                  ? new Date(leadTimeModal.row.orderDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                Sample Sending Date:{" "}
                {leadTimeModal.row.sampleSendingDate
                  ? new Date(leadTimeModal.row.sampleSendingDate).toLocaleDateString()
                  : ""}
              </div>
              <div>
                Lead Time:{" "}
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
            </div>
          )}
          <Button
            onClick={() => setLeadTimeModal({ open: false, row: null })}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleTnaTable;
