import React from "react";
import { PageHeader } from "../ui/page-header";
import { Button } from "../ui/button";
import SampleTnaTable from "./SampleTnaTable";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Filter,
} from "lucide-react";
import { useGetTNASummaryCardQuery } from "@/redux/api/tnaApi";
import TnaSummaryCards from "./TnaSummaryCards";

const tnaCardConfig = [
  {
    status: "On Track",
    key: "onProcess",
    color: "bg-gradient-success",
    textColor: "text-success",
    icon: <CheckCircle className="w-6 h-6 text-white" />,
  },
  {
    status: "Completed",
    key: "completed",
    color: "bg-gradient-accent",
    textColor: "text-warning",
    icon: <AlertTriangle className="w-6 h-6 text-white" />,
  },
  {
    status: "Overdue",
    key: "overdue",
    color: "bg-destructive",
    textColor: "text-destructive",
    icon: <XCircle className="w-6 h-6 text-white" />,
  },
];

const ManagementDashboard = () => {
  const { data: summaryCardData } = useGetTNASummaryCardQuery({});
  console.log("Summary Card Data:", summaryCardData);
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Management Dashboard"
        description=" Overview of all samples and their statuses"
        // actions={
        // }
      />

      <TnaSummaryCards
        tnaCardConfig={tnaCardConfig}
        summaryCardData={summaryCardData || {}}
      />

      <SampleTnaTable readOnlyModals />
    </div>
  );
};

export default ManagementDashboard;
