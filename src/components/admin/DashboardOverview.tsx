import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ClipboardList, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  FileText,
  ArrowUpRight,
  RefreshCw,
  Settings
} from "lucide-react";

const statsCards = [
  {
    title: "Total Users",
    value: "247",
    change: "+12",
    changeType: "positive" as const,
    icon: Users
  },
  {
    title: "Active TNAs",
    value: "89",
    change: "+5",
    changeType: "positive" as const,
    icon: ClipboardList
  },
  {
    title: "On-Time Delivery",
    value: "92%",
    change: "+3%",
    changeType: "positive" as const,
    icon: TrendingUp
  },
  {
    title: "Overdue Tasks",
    value: "23",
    change: "-8",
    changeType: "negative" as const,
    icon: AlertTriangle
  }
];

const recentActivities = [
  {
    id: 1,
    user: "Sarah Chen",
    role: "Merchandiser",
    action: "Created new TNA for Order #TN-2024-001",
    time: "2 minutes ago",
    type: "create"
  },
  {
    id: 2,
    user: "Mike Johnson",
    role: "CAD Designer",
    action: "Completed pattern files for Style ABC-123",
    time: "15 minutes ago",
    type: "complete"
  },
  {
    id: 3,
    user: "Lisa Wang",
    role: "Sample Room",
    action: "Submitted proto sample for approval",
    time: "1 hour ago",
    type: "submit"
  },
  {
    id: 4,
    user: "David Kim",
    role: "Management",
    action: "Approved fabric selection for Order #TN-2024-002",
    time: "2 hours ago",
    type: "approve"
  }
];

const departmentProgress = [
  {
    name: "Merchandising",
    completed: 45,
    total: 52,
    percentage: 87
  },
  {
    name: "CAD Room",
    completed: 32,
    total: 38,
    percentage: 84
  },
  {
    name: "Sample Fabric",
    completed: 28,
    total: 35,
    percentage: 80
  },
  {
    name: "Sample Room",
    completed: 41,
    total: 47,
    percentage: 87
  }
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your Sample TNA</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <Badge 
                      variant={stat.changeType === "positive" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.changeType === "positive" 
                    ? "bg-gradient-success" 
                    : "bg-gradient-primary"
                }`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Progress */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span>Department Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentProgress.map((dept) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{dept.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {dept.completed}/{dept.total} tasks
                  </span>
                </div>
                <Progress value={dept.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-accent" />
                <span>Recent Activity</span>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === "create" ? "bg-accent/10" :
                    activity.type === "complete" ? "bg-success/10" :
                    activity.type === "submit" ? "bg-warning/10" :
                    "bg-primary/10"
                  }`}>
                    {activity.type === "create" && <ClipboardList className="w-4 h-4 text-accent" />}
                    {activity.type === "complete" && <CheckCircle className="w-4 h-4 text-success" />}
                    {activity.type === "submit" && <Clock className="w-4 h-4 text-warning" />}
                    {activity.type === "approve" && <CheckCircle className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.role}</p>
                    <p className="text-sm text-foreground mt-1">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-accent" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <Users className="w-5 h-5 mr-3 text-accent" />
              <div className="text-left">
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-muted-foreground">Add or edit user roles</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <Settings className="w-5 h-5 mr-3 text-accent" />
              <div className="text-left">
                <div className="font-medium">System Settings</div>
                <div className="text-sm text-muted-foreground">Configure system options</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <FileText className="w-5 h-5 mr-3 text-accent" />
              <div className="text-left">
                <div className="font-medium">Generate Report</div>
                <div className="text-sm text-muted-foreground">Export system analytics</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}