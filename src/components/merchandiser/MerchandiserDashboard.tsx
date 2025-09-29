import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import { useGetTNASummaryCardQuery, useGetDepartmentProgressV2Query } from "@/redux/api/tnaApi";
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

const tnaList = [
  {
    id: "TNA-2024-001",
    orderNumber: "ORD-2024-456",
    buyer: "H&M",
    style: "Summer Dress Collection",
    totalTasks: 24,
    completedTasks: 18,
    percentage: 75,
    status: "On Track",
    dueDate: "2024-02-15",
    currentStage: "Sample Room",
    merchandiser: "Sarah Chen",
    priority: "High",
  },
  {
    id: "TNA-2024-002",
    orderNumber: "ORD-2024-457",
    buyer: "Zara",
    style: "Casual Wear Line",
    totalTasks: 20,
    completedTasks: 12,
    percentage: 60,
    status: "At Risk",
    dueDate: "2024-02-20",
    currentStage: "CAD Room",
    merchandiser: "Mike Johnson",
    priority: "Medium",
  },
  {
    id: "TNA-2024-003",
    orderNumber: "ORD-2024-458",
    buyer: "Target",
    style: "Kids Winter Collection",
    totalTasks: 28,
    completedTasks: 14,
    percentage: 50,
    status: "Overdue",
    dueDate: "2024-01-30",
    currentStage: "Sample Fabric",
    merchandiser: "Lisa Wang",
    priority: "High",
  },
  {
    id: "TNA-2024-004",
    orderNumber: "ORD-2024-459",
    buyer: "Gap",
    style: "Basic Tees",
    totalTasks: 16,
    completedTasks: 15,
    percentage: 94,
    status: "On Track",
    dueDate: "2024-02-10",
    currentStage: "Final Review",
    merchandiser: "David Kim",
    priority: "Low",
  },
  {
    id: "TNA-2024-005",
    orderNumber: "ORD-2024-460",
    buyer: "Uniqlo",
    style: "Tech Fabric Pants",
    totalTasks: 22,
    completedTasks: 8,
    percentage: 36,
    status: "At Risk",
    dueDate: "2024-03-01",
    currentStage: "Sample Fabric",
    merchandiser: "Emma Rodriguez",
    priority: "Medium",
  },
];

export function MerchandiserDashboard() {
  const { data: summaryCardData } = useGetTNASummaryCardQuery({});
  const { data: departmentProgressData, isLoading: isDeptLoading } = useGetDepartmentProgressV2Query({});

  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            TNA Progress Monitoring
          </h1>
          <p className="text-muted-foreground">
            Track and monitor Time & Action progress across all orders
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* TNA Overview Cards */}

      <TnaSummaryCards
        tnaCardConfig={tnaCardConfig}
        summaryCardData={summaryCardData || {}}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Progress */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span>Department Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDeptLoading ? (
              <div className="text-center text-muted-foreground py-8">Loading...</div>
            ) : (
              (departmentProgressData?.data || []).map((dept: any) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {dept.department}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {dept.completed}/{dept.total}
                    </span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {dept.percentage}% complete
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span>Timeline Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">67</div>
                <div className="text-sm text-muted-foreground">
                  Total Active TNAs
                </div>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <div className="text-2xl font-bold text-success">23</div>
                <div className="text-sm text-muted-foreground">
                  Completed This Week
                </div>
              </div>
              <div className="text-center p-4 bg-warning/5 rounded-lg">
                <div className="text-2xl font-bold text-warning">12</div>
                <div className="text-sm text-muted-foreground">
                  Due This Week
                </div>
              </div>
              <div className="text-center p-4 bg-destructive/5 rounded-lg">
                <div className="text-2xl font-bold text-destructive">7</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TNA List Table */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-accent" />
              <span>Active TNAs</span>
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TNA Details</TableHead>
                <TableHead>Buyer & Style</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Merchandiser</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tnaList.map((tna) => (
                <TableRow key={tna.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">
                        {tna.id}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tna.orderNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">
                        {tna.buyer}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tna.style}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {tna.completedTasks}/{tna.totalTasks} tasks
                        </span>
                        <span className="text-sm font-medium">
                          {tna.percentage}%
                        </span>
                      </div>
                      <Progress value={tna.percentage} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tna.currentStage}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tna.status === "On Track"
                          ? "default"
                          : tna.status === "At Risk"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        tna.status === "On Track"
                          ? "bg-gradient-success"
                          : tna.status === "At Risk"
                          ? "bg-gradient-accent"
                          : ""
                      }
                    >
                      {tna.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tna.dueDate}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tna.merchandiser}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
 