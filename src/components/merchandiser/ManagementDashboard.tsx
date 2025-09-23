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
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tnaCardConfig.map((item) => {
          const count = summaryCardData?.[item.key] ?? 0;
          const total = summaryCardData?.total ?? 1;
          const percentage = total ? Math.round((count / total) * 100) : 0;
          return (
            <Card
              key={item.status}
              className="bg-gradient-card border-0 shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.status} TNAs
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {count}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={percentage} className="flex-1" />
                  <span className={`text-sm font-medium ${item.textColor}`}>
                    {percentage}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <SampleTnaTable readOnlyModals />
    </div>
  );
};

export default ManagementDashboard;
