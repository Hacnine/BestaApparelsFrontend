import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SampleDevelopement = () => {
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    style: "",
    samplemanName: "",
    sampleReceiveDate: "",
    sampleCompleteDate: "",
    sampleQuantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    setForm({
      style: "",
      samplemanName: "",
      sampleReceiveDate: "",
      sampleCompleteDate: "",
      sampleQuantity: "",
    });
    setOpenForm(false);
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
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SampleDevelopement;
