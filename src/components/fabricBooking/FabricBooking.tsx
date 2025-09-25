import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useGetFabricBookingQuery, useCreateFabricBookingMutation } from "@/redux/api/cadApi";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const FabricBooking = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Search and date filter state
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Query with search and date range
  const { data, error, isLoading } = useGetFabricBookingQuery({
    page,
    pageSize,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const [createFabricBooking, { isLoading: isCreating }] = useCreateFabricBookingMutation();
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    fabricStyle: "",
    bookingDate: "",
    receiveDate: "",
  });
console.log(data)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createFabricBooking({
        style: form.fabricStyle,
        bookingDate: form.bookingDate,
        receiveDate: form.receiveDate,
      }).unwrap();
      setForm({
        fabricStyle: "",
        bookingDate: "",
        receiveDate: "",
      });
      setOpenForm(false);
      toast.success("Fabric booking created successfully");
    } catch (error) {
      toast.error("Failed to create fabric booking");
    }
  };

  // Reset to first page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, startDate, endDate]);

  return (
    <div className="p-4 space-y-6 ">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fabric Booking</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage fabric bookings and track their status efficiently.
        </p> 
        </div>
        <div className="">
          <Button onClick={() => setOpenForm((prev) => !prev)}>
        {openForm ? "Close Form" : "Add Fabric Booking"}
      </Button>
      {openForm && (
        <Card className="mt-4">
          <CardContent className="py-6">
            <form
              className="grid md:grid-cols-2 grid-cols-1 gap-4"
              onSubmit={handleSubmit}
            >
              <div className=" col-span-2">
                <label className="text-sm font-medium">Fabric Style</label>
                <Input
                  name="fabricStyle"
                  value={form.fabricStyle}
                  onChange={handleChange}
                  placeholder="Enter fabric style"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Booking Date</label>
                <Input
                  name="bookingDate"
                  type="date"
                  value={form.bookingDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Receive Date</label>
                <Input
                  name="receiveDate"
                  type="date"
                  value={form.receiveDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <Button type="submit" disabled={isCreating}>Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
        </div>
       
      </div>
      {/* Search Controls */}
      <div className="flex flex-wrap gap-2 mb-4 items-end w-[85%]">
        <div>
          <label className="block text-xs font-medium mb-1">Search</label>
          <input
            type="text"
            className="border rounded px-2 py-1 md:w-[300px]"
            placeholder="Search By Style"
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
      

      {/* Fabric Booking Table */}
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Receive Date</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.data || []).map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>{row.style}</TableCell>
                  <TableCell>
                    {row.bookingDate
                      ? new Date(row.bookingDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {row.receiveDate
                      ? new Date(row.receiveDate).toLocaleDateString()
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
              onClick={() =>
                setPage((p) =>
                  data?.totalPages
                    ? Math.min(data.totalPages, p + 1)
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

export default FabricBooking;
