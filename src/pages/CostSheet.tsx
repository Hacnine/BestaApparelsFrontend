import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import CostSheetForm from "@/components/cost-sheet/CostSheetForm";
import CostSheetTable from "@/components/cost-sheet/CostSheetTable";

const CostSheet = () => {
  const [openCostSheet, setOpenCostSheet] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Cost Sheet Management
              </h1>
              <p className="text-muted-foreground">
                Create and manage detailed cost sheets for your apparel
                manufacturing
              </p>
            </div>
            <Button
              onClick={() => setOpenCostSheet(true)}
              className="text-base "
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Cost Sheet
            </Button>
          </div>

          {/* Search Input - match table width */}
          <Card className="p-4 mb-4 w-full">
            <div className="flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder="Search by style, item, buyer, etc."
                // value={search}
                // onChange={e => {
                //   setSearch(e.target.value);
                //   setPage(1); // Reset to first page on new search
                // }}
                className="border rounded px-2 py-1 w-full max-w-[400px]"
                disabled
              />
              <Button
                variant="outline"
                size="sm"
                // onClick={() => setSearch("")}
                disabled
              >
                Clear
              </Button>
            </div>
          </Card>

          {/* Cost Sheet Form */}
          {openCostSheet && (
            <Card className="p-4 w-full ">
              <CostSheetForm onClose={() => setOpenCostSheet(false)} />
            </Card>
          )}

          {/* Placeholder for Cost Sheet Table/List */}
          <CostSheetTable />
        </div>
      </div>
    </div>
  );
};

export default CostSheet;

