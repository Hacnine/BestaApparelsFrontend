import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const FabricBooking = () => {
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    fabricStyle: "",
    bookingDate: "",
    receiveDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Submit logic here
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

  return (
    <div className="p-4 space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fabric Booking</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage fabric bookings and track their status efficiently.
        </p>
      </div>
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
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FabricBooking;
