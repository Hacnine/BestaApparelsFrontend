import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useCreateTnaMutation, useGetBuyersQuery, useGetMerchandisersQuery } from "@/redux/api/merchandiserApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TnaFormProps {
  onSuccess: () => void;
}
interface TnaFormState {
  buyerId: string;
  style: string;
  itemName: string;
  sampleSendingDate: string;
  orderDate: string;
  userId: string;
  status: string;
  sampleType: string;
}
interface Buyer { id: string; name: string; }
interface Merchandiser { id: string; userName: string; }

export default function TnaForm({ onSuccess }: TnaFormProps) {
  const [form, setForm] = useState<TnaFormState>({
    buyerId: "",
    style: "",
    itemName: "",
    sampleSendingDate: "",
    orderDate: "",
    userId: "",
    status: "ACTIVE",
    sampleType: "",
  });
  const [createTna, { isLoading }] = useCreateTnaMutation();
  const { data: buyersResponse } = useGetBuyersQuery({});
  const { data: merchandisers } = useGetMerchandisersQuery({});

  const buyers = buyersResponse?.data ?? [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof TnaFormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTna({
        ...form,
        sampleSendingDate: new Date(form.sampleSendingDate).toISOString(),
        orderDate: new Date(form.orderDate).toISOString(),
      }).unwrap();
      toast.success("TNA created successfully");
      setForm({
        buyerId: "",
        style: "",
        itemName: "",
        sampleSendingDate: "",
        orderDate: "",
        userId: "",
        status: "ACTIVE",
        sampleType: "",
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to create TNA");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">Buyer</label>
        <Select value={form.buyerId} onValueChange={(v) => handleSelectChange("buyerId", v)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select buyer" />
          </SelectTrigger>
          <SelectContent>
            {buyers.map((buyer: Buyer) => (
              <SelectItem key={buyer.id} value={buyer.id}>{buyer.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Style</label>
        <Input name="style" value={form.style} onChange={handleChange} placeholder="Enter style" required />
      </div>
      <div>
        <label className="text-sm font-medium">Item Name</label>
        <Input name="itemName" value={form.itemName} onChange={handleChange} placeholder="Enter item name" required />
      </div>
      <div>
        <label className="text-sm font-medium">File Receive Date</label>
        <Input name="orderDate" type="date" value={form.orderDate} onChange={handleChange} required />
      </div>
      <div>
        <label className="text-sm font-medium">Sample Sending Date</label>
        <Input name="sampleSendingDate" type="date" value={form.sampleSendingDate} onChange={handleChange} required />
      </div>
      <div>
        <label className="text-sm font-medium">Merchandiser</label>
        <Select value={form.userId} onValueChange={(v) => handleSelectChange("userId", v)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select merchandiser" />
          </SelectTrigger>
          <SelectContent>
            {merchandisers?.map((user: Merchandiser) => (
              <SelectItem key={user.id} value={user.id}>{user.userName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Sample Type</label>
        <Select value={form.sampleType} onValueChange={(v) => handleSelectChange("sampleType", v)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select sample type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DVP">DVP</SelectItem>
            <SelectItem value="PP1">PP1</SelectItem>
            <SelectItem value="PP2">PP2</SelectItem>
            <SelectItem value="PP3">PP3</SelectItem>
            <SelectItem value="PP4">PP4</SelectItem>
            <SelectItem value="PP5">PP5</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* <div>
        <label className="text-sm font-medium">Status</label>
        <Select value={form.status} onValueChange={(v) => handleSelectChange("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div> */}
      <div className="col-span-2 flex justify-center">
        <Button className="w-[400px] self-end" type="submit" disabled={isLoading}>Create TNA</Button>
      </div>
    </form>
  );
}
