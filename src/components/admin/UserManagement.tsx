import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "../../redux/api/userApi";
import { useGetEmployeesQuery } from "../../redux/api/employeeApi";
import { Employee } from "@/types/employee";
import toast from "react-hot-toast";
import RoleStats from "./RoleStats";

const userRoles = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "MANAGEMENT",
    label: "Management",
  },
  {
    value: "MERCHANDISER",
    label: "Merchandiser",
  },
  {
    value: "CAD",
    label: "CAD",
  },
  {
    value: "SAMPLE_FABRIC",
    label: "Sample Fabric",
  },
  {
    value: "SAMPLE_ROOM",
    label: "Sample Room",
  },
];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    role: "",
    status: "Active",
  });
  // New states for employee selection in add dialog
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: users, isLoading } = useGetUsersQuery({
    search: searchTerm,
    role: roleFilter === "all" ? "" : roleFilter,
  });

  const [createUser, { isLoading: isCreating, isSuccess: isCreated }] =
    useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating, isSuccess: isUpdated }] =
    useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  // Query for searching employees in add dialog
  const { data: employeeData, isLoading: isEmployeeLoading } =
    useGetEmployeesQuery(
      {
        search: employeeSearchTerm,
        page: 1,
      },
      { skip: !employeeSearchTerm }
    );
  const employeeSearchResults = employeeData?.data || [];

  const handleAddUser = async () => {
    if (!selectedEmployee || !userName || !password || !selectedRole) {
      toast.error("Please select an employee and fill all required fields.");
      return;
    }
    try {
      await createUser({
        employeeEmail: selectedEmployee.email,
        userName: userName,
        password: password,
        role: selectedRole,
      }).unwrap();
      // Reset states
      setEmployeeSearchTerm("");
      setSelectedEmployee(null);
      setUserName("");
      setPassword("");
      setSelectedRole("");
      setIsAddDialogOpen(false);
      toast.success(`${userName} has been successfully added.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add user.");
    }
  };

  const handleSelectEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEmployeeSearchTerm(""); // Clear search after selection
  };

  const handleEditUser = async () => {
    console.log(editingUser.id);
    try {
      await updateUser({ id: editingUser.id, ...formData }).unwrap();
      setIsEditDialogOpen(false);
      setEditingUser(null);
      setFormData({
        userName: "",
        email: "",
        role: "",
        status: "Active",
      });
      toast.success(`User information has been successfully updated.`);
    } catch (err) {
      toast.error(`Failed to update user.`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success(`User has been successfully deleted.`);
    } catch (err) {
      toast.error(`Failed to delete user.`);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId).unwrap();
      toast.success(`User status has been updated.`);
    } catch (err) {
      toast.error(`Failed to update status.`);
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };


  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage users, roles and permissions
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Search and select an employee, then provide user details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Employee Search */}
                <div className="space-y-2">
                  <Label htmlFor="employeeSearch">
                    Search Employee by Email or Custom ID
                  </Label>
                  <Input
                    id="employeeSearch"
                    placeholder="Enter email or custom ID..."
                    value={employeeSearchTerm}
                    onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  />
                  {isEmployeeLoading && (
                    <p className="text-sm text-muted-foreground">
                      Searching...
                    </p>
                  )}
                  {employeeSearchResults.length > 0 && !selectedEmployee && (
                    <div className="max-h-40 overflow-y-auto border rounded-md">
                      {employeeSearchResults.map((employee: any) => (
                        <div
                          key={employee.id}
                          className="p-2 hover:bg-accent cursor-pointer flex justify-between items-center"
                          onClick={() => handleSelectEmployee(employee)}
                        >
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.email} - {employee.customId}
                            </div>
                          </div>
                          {selectedEmployee?.id === employee.id && (
                            <span className="text-green-500">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedEmployee && (
                    <div className="p-3 bg-accent/50 rounded-md">
                      <p className="text-sm">
                        Selected: {selectedEmployee.name} (
                        {selectedEmployee.email})
                      </p>
                    </div>
                  )}
                </div>

                {/* Custom User Name */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="userName" className="text-right">
                    Custom Username
                  </Label>
                  <Input
                    id="userName"
                    placeholder="Enter custom username"
                    className="col-span-3"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="col-span-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Role Select */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddUser}
                  disabled={
                    !selectedEmployee || !userName || !password || !selectedRole
                  }
                >
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="col-span-3"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
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
                  <Select
                    value={formData.role}
                    onValueChange={(role) => setFormData({ ...formData, role })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEditUser}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Statistics */}
      <RoleStats />

      {/* Filters and Search */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
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

      {/* Users Table */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent" />
            <span>Users ({users?.data.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="min-w-full text-center flex items-center justify-center">
              Loading users...
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.data?.map((user: any) => (
                <TableRow key={user?.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10  flex items-center justify-center">
                        <span className="text-gray-500 text-sm font-medium capitalize">
                          {user?.userName}
                        </span>
                      </div>
                      <div></div>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="text-sm text-muted-foreground">
                      {user?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user?.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user?.phoneNumber}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4 text-green-500" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the user account and remove all
                              associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user?.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && users?.data.length === 0 && (
            <div>
              No users found
              {searchTerm ? ` for "${searchTerm}"` : ""}.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UserManagement;
