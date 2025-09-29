import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  useCreateCadApprovalMutation,
  useGetCadApprovalQuery,
  useUpdateCadDesignMutation, // <-- import mutation
} from "@/redux/api/cadApi";
import toast from "react-hot-toast";

const CadDesignDashboard = () => {
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    style: "",
    fileReceiveDate: "",
    completeDate: "",
    cadMasterName: "",
  });
  const [createCadApproval, { isLoading }] = useCreateCadApprovalMutation();
  const [updateCadDesign, { isLoading: isUpdating }] = useUpdateCadDesignMutation(); // <-- add mutation

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Search and date filter state
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Query with search and date range
  const { data: cadApprovals, isLoading: isTableLoading } = useGetCadApprovalQuery(
    {
      page,
      pageSize,
      search: search || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }
  );

  // Reset to first page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, startDate, endDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editId) {
        // Edit mode
        await updateCadDesign({
          id: editId,
          style: form.style,
          fileReceiveDate: new Date(form.fileReceiveDate).toISOString(),
          completeDate: new Date(form.completeDate).toISOString(),
          CadMasterName: form.cadMasterName,
        }).unwrap();
        toast.success("CAD Design approval updated successfully");
      } else {
        // Create mode
        await createCadApproval({
          style: form.style,
          fileReceiveDate: new Date(form.fileReceiveDate).toISOString(),
          completeDate: new Date(form.completeDate).toISOString(),
          cadMasterName: form.cadMasterName,
        }).unwrap();
        toast.success("CAD Design approval created successfully");
      }
      setForm({
        style: "",
        fileReceiveDate: "",
        completeDate: "",
        cadMasterName: "",
      });
      setOpenForm(false);
      setEditId(null);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to submit CAD Design approval");
    }
  };

  // Edit handler
  const handleEdit = (row: any) => {
    setForm({
      style: row.style || "",
      fileReceiveDate: row.fileReceiveDate
        ? new Date(row.fileReceiveDate).toISOString().slice(0, 10)
        : "",
      completeDate: row.completeDate
        ? new Date(row.completeDate).toISOString().slice(0, 10)
        : "",
      cadMasterName: row.CadMasterName || "",
    });
    setEditId(row.id);
    setOpenForm(true);
  };

  return (
    <div className="p-4 space-y-6 ">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-3xl font-bold text-foreground">
          CAD Design Approval
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage CAD design entries and track progress efficiently.
        </p>
        </div>

        <Button onClick={() => setOpenForm((prev) => !prev)}>
        {openForm ? "Close Form" : "Add CAD Approval"}
      </Button>
      </div>
      
      {/* Search Controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-end w-[85%]">
        <div>
          <label className="block text-xs font-medium mb-1">Search</label>
          <input
            type="text"
            className="border rounded px-2 py-1 md:w-[300px] placeholder:text-sm"
            placeholder="Search By Style, Name "
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
      
      {openForm && (
        <Card className="mt-4">
          <CardContent className="py-6">
            <form
              className="grid md:grid-cols-2 grid-cols-1 gap-4"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="text-sm font-medium">Style</label>
                <Input
                  name="style"
                  value={form.style}
                  onChange={handleChange}
                  placeholder="Enter style"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cad Master Name</label>
                <Input
                  name="cadMasterName"
                  value={form.cadMasterName}
                  onChange={handleChange}
                  placeholder="Enter CAD master name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">File Receive Date</label>
                <Input
                  name="fileReceiveDate"
                  type="date"
                  value={form.fileReceiveDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Complete Date</label>
                <Input
                  name="completeDate"
                  type="date"
                  value={form.completeDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2  flex justify-center">
                <Button className="" type="submit" disabled={isLoading || isUpdating}>
                  {editId ? "Update" : "Submit"}
                </Button>
                {editId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      setEditId(null);
                      setForm({
                        style: "",
                        fileReceiveDate: "",
                        completeDate: "",
                        cadMasterName: "",
                      });
                      setOpenForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* CAD Approval Table */}
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style</TableHead>
                <TableHead>CAD Master Name</TableHead>
                <TableHead>File Receive Date</TableHead>
                <TableHead>Complete Date</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Action</TableHead> {/* Add Action column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(cadApprovals?.data || []).map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>{row.style}</TableCell>
                  <TableCell>{row.CadMasterName}</TableCell>
                  <TableCell>
                    {row.fileReceiveDate
                      ? new Date(row.fileReceiveDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {row.completeDate
                      ? new Date(row.completeDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {row.updatedAt
                      ? new Date(row.updatedAt).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </Button>
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
              Page {cadApprovals?.page || page} of{" "}
              {cadApprovals?.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={cadApprovals?.page >= cadApprovals?.totalPages}
              onClick={() =>
                setPage((p) =>
                  cadApprovals?.totalPages
                    ? Math.min(cadApprovals.totalPages, p + 1)
                    : p + 1
                )
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CadDesignDashboard;
