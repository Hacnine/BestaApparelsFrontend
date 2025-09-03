import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Plus, Edit, Trash2, UserCheck, UserX, Users } from "lucide-react";
import { useGetUsersQuery, useGetUserStatsQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation, useToggleUserStatusMutation } from "../../redux/api/userApi";

const userRoles = ["Admin", "Management", "Merchandiser", "CAD", "Sample Fabric", "Sample Room"];

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
    department: ""
  });
  const { toast } = useToast();

  const { data: users = [], isLoading } = useGetUsersQuery({ search: searchTerm, role: roleFilter });
  const { data: stats } = useGetUserStatsQuery({});
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const handleAddUser = async () => {
    try {
      await createUser(formData).unwrap();
      setFormData({ name: "", email: "", role: "", status: "Active", department: "" });
      setIsAddDialogOpen(false);
      toast({ title: "User added", description: `${formData.name} has been successfully added.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to add user." });
    }
  };

  const handleEditUser = async () => {
    try {
      await updateUser({ id: editingUser.id, ...formData }).unwrap();
      setIsEditDialogOpen(false);
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "", status: "Active", department: "" });
      toast({ title: "User updated", description: `User information has been successfully updated.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update user." });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast({ title: "User deleted", description: "User has been successfully deleted." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete user." });
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId).unwrap();
      toast({ title: "Status updated", description: `User status has been updated.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status." });
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department
    });
    setIsEditDialogOpen(true);
  };

  // User stats fallback
  const roleStats = stats || {
    total: users.length,
    active: users.filter((u: any) => u.status === "Active").length,
    admin: users.filter((u: any) => u.role === "Admin").length,
    management: users.filter((u: any) => u.role === "Management").length,
    merchandiser: users.filter((u: any) => u.role === "Merchandiser").length,
    cad: users.filter((u: any) => u.role === "CAD").length,
    sampleFabric: users.filter((u: any) => u.role === "Sample Fabric").length,
    sampleRoom: users.filter((u: any) => u.role === "Sample Room").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles and permissions</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with role and permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="col-span-3"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input 
                    id="email" 
                    placeholder="Email" 
                    className="col-span-3"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Select value={formData.role} onValueChange={role => setFormData({...formData, role})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input 
                    id="department" 
                    placeholder="Department" 
                    className="col-span-3"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser}>Add</Button>
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input 
                    id="email" 
                    placeholder="Email" 
                    className="col-span-3"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Select value={formData.role} onValueChange={role => setFormData({...formData, role})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input 
                    id="department" 
                    placeholder="Department" 
                    className="col-span-3"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{roleStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">{roleStats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-foreground">{roleStats.admin}</p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">A</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Merchandisers</p>
                <p className="text-2xl font-bold text-foreground">{roleStats.merchandiser}</p>
              </div>
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-accent font-bold text-sm">M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {userRoles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-accent" />
            <span>Users ({users.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.department}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === "Active" ? "default" : "secondary"}
                      className={user.status === "Active" ? "bg-green-500" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user.id)}>
                        {user.status === "Active" ? (
                          <UserX className="h-4 w-4 text-red-500" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        )}
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
                              This action cannot be undone. This will permanently delete the user
                              account and remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
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
        </CardContent>
      </Card>
    </div>
  );
}