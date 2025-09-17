import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DepartmentForm from "./DepartmentForm";
import TnaForm from "./TnaForm";
import BuyerForm from "./BuyerForm";

export default function MerchandiserDashboard() {
  const navigate = useNavigate();
  const [openDepartment, setOpenDepartment] = useState(false);

  const [openTna, setOpenTna] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="New Order"
        description="Create a new order with buyer, department, and TNA details"
      />
      <div className="flex gap-6">
        {/* <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
          <PopoverTrigger asChild>
            <Button onClick={() => setOpenDepartment(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Department
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <DepartmentForm onSuccess={() => setOpenDepartment(false)} />
          </PopoverContent>
        </Popover> */}
 
        <Popover open={openTna} onOpenChange={setOpenTna}>
          <PopoverTrigger asChild>
            <Button onClick={() => setOpenTna(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create TNA
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <TnaForm onSuccess={() => setOpenTna(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
