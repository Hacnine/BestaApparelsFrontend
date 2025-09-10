import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search, Plus, Users } from "lucide-react";
import {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeStatusMutation,
} from "@/redux/api/employeeApi";

const departments = [
  "Merchandising",
  "CAD Room",
  "Sample Fabric",
  "Sample Room",
];

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customId: "",
    phoneNumber: "",
    name: "",
    email: "",
    designation: "",
    department: "",
    status: "ACTIVE",
  });
  

  // RTK Query hooks
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const { data, error, isLoading } = useGetEmployeesQuery({
    page,
    search: searchTerm,
    department: departmentFilter !== "all" ? departmentFilter : "",
  });
  const [updateEmployeeStatus, { isLoading: isUpdatingStatus }] =
    useUpdateEmployeeStatusMutation();

  // Extract data
  const employees = data?.data || [];
  const pagination = data?.pagination || {};

  // Handle add employee
  const handleAddEmployee = async () => {
    try {
      await createEmployee(formData).unwrap();
      setFormData({
        customId: "",
        phoneNumber: "",
        name: "",
        email: "",
        designation: "",
        department: "",
        status: "ACTIVE",
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Employee added",
        description: `${formData.name} has been successfully added.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to add employee.",
        variant: "destructive",
      });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    employeeId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateEmployeeStatus({
        id: employeeId,
        status: newStatus,
      }).unwrap();
      toast({
        title: "Status updated",
        description: `Employee status changed to ${newStatus.toLowerCase()}.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to update employee status.",
        variant: "destructive",
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to page 1 on search change
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Employee Management
          </h1>
          <p className="text-muted-foreground">
            Manage employees, roles, and permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new employee account with role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="customId"
                  placeholder="Custom ID (e.g., EMP001)"
                  className="col-span-3"
                  value={formData.customId}
                  onChange={(e) =>
                    setFormData({ ...formData, customId: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="email"
                  placeholder="Email"
                  className="col-span-3"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="phoneNumber"
                  placeholder="Phone Number (e.g., +1234567890)"
                  className="col-span-3"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="designation"
                  placeholder="Designation"
                  className="col-span-3"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Select
                  value={formData.department}
                  onValueChange={(dept) =>
                    setFormData({ ...formData, department: dept })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddEmployee} disabled={isCreating}>
                {isCreating ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by custom ID, email, phone, department, or designation..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {searchTerm && (
              <Button variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent" />
            <span>Employees ({pagination?.totalEmployees || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          {error && (
            <div className="text-red-500">
              Error: {"Failed to load employees"}
            </div>
          )}
          {!isLoading && !error && employees.length === 0 && (
            <div>
              No employees found
              {pagination?.search ? ` for "${pagination.search}"` : ""}.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Custom ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right flex">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <div className=" min-w-full text-center flex items-center justify-center-safe">Loading employees...</div>}
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.customId}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "ACTIVE" ? "secondary" : "destructive"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(employee.id, employee.status)
                      }
                      disabled={isUpdatingStatus}
                    >
                      {employee.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination?.totalEmployees > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalEmployees
                )}{" "}
                of {pagination.totalEmployees} employees
                {pagination?.search ? ` (search: "${pagination.search}")` : ""}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeManagement;