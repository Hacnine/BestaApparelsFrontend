import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TnaForm from "./TnaForm";
import { useGetTNAsQuery } from "@/redux/api/tnaApi"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function SampleTna() {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch with pagination params
  const { data, isLoading, error } = useGetTNAsQuery({ page, pageSize });
  const [openTna, setOpenTna] = useState(false);
  const [modal, setModal] = useState({ open: false, type: null, details: null });
console.log("TNA Data:", data, isLoading, error);
  // Modal state for merchandiser and buyer
  const openDetailsModal = (type, details) => setModal({ open: true, type, details });
  const closeModal = () => setModal({ open: false, type: null, details: null });

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="New Order"
        description=" Manage your sample TNA here."
        actions={
          <Button onClick={() => setOpenTna((prev) => !prev)}>
            <Plus className="h-4 w-4 mr-2" />
            Create TNA
          </Button>
        }
      />

      {openTna && (
        <Card className="p-4 ">
          <TnaForm onSuccess={() => setOpenTna(false)} />
        </Card>
      )}

      {/* TNA Table */}
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Style</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Sample Sending Date</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sample Type</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Merchandiser</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.data || []).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.style}</TableCell>
                <TableCell>{row.itemName}</TableCell>
                <TableCell>
                  {row.sampleSendingDate
                    ? new Date(row.sampleSendingDate).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>
                  {row.orderDate
                    ? new Date(row.orderDate).toLocaleDateString()
                    : ""}
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.sampleType}</TableCell>
                <TableCell>
                  {row.buyer?.name ? (
                    <Button
                      variant="link"
                      onClick={() => openDetailsModal("buyer", row.buyer)}
                    >
                      {row.buyer.name}
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  {row.merchandiser?.userName ? (
                    <Button
                      variant="link"
                      onClick={() => openDetailsModal("merchandiser", row.merchandiser)}
                    >
                      {row.merchandiser.userName}
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span>
            Page {data?.page || page} of {data?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data?.page >= data?.totalPages}
            onClick={() => setPage((p) => (data?.totalPages ? Math.min(data.totalPages, p + 1) : p + 1))}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Details Modal */}
      <Dialog open={modal.open} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.type === "buyer"
                ? "Buyer Details"
                : modal.type === "merchandiser"
                ? "Merchandiser Details"
                : ""}
            </DialogTitle>
          </DialogHeader>
          {modal.details && (
            <div className="space-y-2">
              {modal.type === "buyer" && (
                <>
                  <div><strong>Name:</strong> {modal.details.name}</div>
                  <div><strong>Country:</strong> {modal.details.country}</div>
                  <div><strong>Department ID:</strong> {modal.details.buyerDepartmentId || "-"}</div>
                </>
              )}
              {modal.type === "merchandiser" && (
                <>
                  <div><strong>Name:</strong> {modal.details.userName}</div>
                  <div><strong>Role:</strong> {modal.details.role}</div>
                  <div><strong>Employee ID:</strong> {modal.details.employeeId}</div>
                </>
              )}
            </div>
          )}
          <Button onClick={closeModal}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
