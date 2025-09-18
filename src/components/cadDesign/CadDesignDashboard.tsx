import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateCadApprovalMutation } from "@/redux/api/cadApi";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createCadApproval({
        style: form.style,
        fileReceiveDate: new Date(form.fileReceiveDate).toISOString(),
        completeDate: new Date(form.completeDate).toISOString(),
        cadMasterName: form.cadMasterName,
      }).unwrap();
      toast.success("CAD Design approval created successfully");
      setForm({
        style: "",
        fileReceiveDate: "",
        completeDate: "",
        cadMasterName: "",
      });
      setOpenForm(false);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to create CAD Design approval");
    }
  };

  return (
    <div className="p-4 space-y-6 ">
      <div>
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
                <Button className='' type="submit" disabled={isLoading}>Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CadDesignDashboard;
