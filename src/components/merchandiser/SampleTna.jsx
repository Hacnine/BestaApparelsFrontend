import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import TnaForm from "./TnaForm";

export default function SampleTna() {
  const navigate = useNavigate();
  const [openTna, setOpenTna] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="New Order"
        description="Create a new order with buyer, department, and TNA details"
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
    </div>
  );
}
