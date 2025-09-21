import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateSampleDevelopmentMutation, useGetSampleDevelopmentQuery } from '@/redux/api/cadApi';
import toast from 'react-hot-toast';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const SampleDevelopement = () => {
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    style: "",
    samplemanName: "",
    sampleReceiveDate: "",
    sampleCompleteDate: "",
    sampleQuantity: "",
  });
  const [createSampleDevelopment, { isLoading }] = useCreateSampleDevelopmentMutation();

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading: isTableLoading } = useGetSampleDevelopmentQuery
    ? useGetSampleDevelopmentQuery({ page, pageSize })
    : { data: null, isLoading: false };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await createSampleDevelopment({
        style: form.style,
        samplemanName: form.samplemanName,
        sampleReceiveDate: new Date(form.sampleReceiveDate).toISOString(),
        sampleCompleteDate: new Date(form.sampleCompleteDate).toISOString(),
        sampleQuantity: Number(form.sampleQuantity),
      }).unwrap();
      toast.success('Sample Development created successfully');
      setForm({
        style: "",
        samplemanName: "",
        sampleReceiveDate: "",
        sampleCompleteDate: "",
        sampleQuantity: "",
      });
      setOpenForm(false);
    } catch (error) {
      toast.error(error?.data?.error || 'Failed to create Sample Development');
    }
  };

  return (
    <div className="p-4 space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sample Development</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage sample development entries and track progress efficiently.
        </p>
      </div>
      <Button onClick={() => setOpenForm((prev) => !prev)}>
        {openForm ? "Close Form" : "Add Sample Development"}
      </Button>
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
                <label className="text-sm font-medium">Sampleman Name</label>
                <Input
                  name="samplemanName"
                  value={form.samplemanName}
                  onChange={handleChange}
                  placeholder="Enter sampleman name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sample Receive Date</label>
                <Input
                  name="sampleReceiveDate"
                  type="date"
                  value={form.sampleReceiveDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sample Complete Date</label>
                <Input
                  name="sampleCompleteDate"
                  type="date"
                  value={form.sampleCompleteDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sample Quantity</label>
                <Input
                  name="sampleQuantity"
                  type="number"
                  value={form.sampleQuantity}
                  onChange={handleChange}
                  placeholder="Enter sample quantity"
                  required
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <Button type="submit" disabled={isLoading}>Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sample Development Table */}
      <Card className="mt-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Style</TableHead>
                <TableHead>Sampleman Name</TableHead>
                <TableHead>Sample Receive Date</TableHead>
                <TableHead>Sample Complete Date</TableHead>
                <TableHead>Sample Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.data || []).map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>{row.style}</TableCell>
                  <TableCell>{row.samplemanName}</TableCell>
                  <TableCell>
                    {row.sampleReceiveDate
                      ? new Date(row.sampleReceiveDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    {row.sampleCompleteDate
                      ? new Date(row.sampleCompleteDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{row.sampleQuantity}</TableCell>
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

export default SampleDevelopement;
