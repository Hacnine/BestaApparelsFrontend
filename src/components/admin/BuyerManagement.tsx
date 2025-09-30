import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import BuyerForm from "../merchandiser/BuyerForm";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useGetBuyersQuery } from "@/redux/api/buyerApi";

export default function BuyerManagement() {
  const navigate = useNavigate();
  const [openTna, setOpenTna] = useState(false);
  const { data } = useGetBuyersQuery({});

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Buyer Management"
        description="Manage all of the buyers"
        actions={
          <Button onClick={() => setOpenTna((prev) => !prev)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Buyer
          </Button>
        }
      />

      {openTna && (
        <Card className="p-4 ">
            <BuyerForm />
        </Card>
      )}

      {/* Buyer List Table */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Buyers</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((buyer: any) => (
              <TableRow key={buyer.id}>
                <TableCell>{buyer.id}</TableCell>
                <TableCell>{buyer.name}</TableCell>
                <TableCell>{buyer.country}</TableCell>
                <TableCell>{buyer.buyerDepartments?.name || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
