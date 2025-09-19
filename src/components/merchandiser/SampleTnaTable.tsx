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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useGetTNASummaryQuery } from "@/redux/api/tnaApi";

const SampleTnaTable = () => {
  const [isBuyerModalVisible, setBuyerModalVisible] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState("");
  const [leadTimePopover, setLeadTimePopover] = useState<string | null>(null);
  const { data: tnaSummary } = useGetTNASummaryQuery();
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
            <TableHead>Fabric</TableHead>
            <TableHead>Sample Type</TableHead>
            <TableHead>CAD</TableHead>
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
                    <Popover
                      open={leadTimePopover === row.id}
                      onOpenChange={(open) =>
                        setLeadTimePopover(open ? row.id : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button variant="link">{leadTime} days</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          Order Date:{" "}
                          {new Date(row.orderDate).toLocaleDateString()}
                        </div>
                        <div>
                          Sample Sending Date:{" "}
                          {new Date(row.sampleSendingDate).toLocaleDateString()}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>{/* Fabric empty */}</TableCell>
                <TableCell>{row.sampleType || ""}</TableCell>
                <TableCell>{/* CAD empty */}</TableCell>
                <TableCell>{/* Sample empty */}</TableCell>
                <TableCell>{/* DHL Tracking empty */}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Dialog open={isBuyerModalVisible} onOpenChange={setBuyerModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buyer Info</DialogTitle>
          </DialogHeader>
          <div>{buyerInfo}</div>
          <Button onClick={handleBuyerModalClose}>OK</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleTnaTable;
