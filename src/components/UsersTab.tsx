import { useState } from "react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "./ConfirmationDialog";

interface UsersTabProps {
  users: User[];
  onToggleActive: (userId: string) => void;
  onDeleteUsers: (userIds: string[]) => void;
}

export const UsersTab = ({ users, onToggleActive, onDeleteUsers }: UsersTabProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);

  // Safety check to ensure users is an array
  const safeUsers = Array.isArray(users) ? users : [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(safeUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to delete",
        variant: "destructive",
      });
      return;
    }
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeleteUsers(selectedUsers);
    setSelectedUsers([]);
    toast({
      title: "Users deleted",
      description: `Successfully deleted ${selectedUsers.length} user(s)`,
    });
  };

  const handleToggleUser = (user: User) => {
    setUserToToggle(user);
    setToggleDialogOpen(true);
  };

  const confirmToggle = () => {
    if (userToToggle) {
      onToggleActive(userToToggle.id);
      toast({
        title: "User status updated",
        description: `${userToToggle.name} is now ${userToToggle.isActive ? "inactive" : "active"}`,
      });
    }
  };

  const allSelected = safeUsers.length > 0 && selectedUsers.length === safeUsers.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Users Management</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteSelected}
          disabled={selectedUsers.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected ({selectedUsers.length})
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all users"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) =>
                      handleSelectUser(user.id, checked as boolean)
                    }
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(user.joinedDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-sm text-muted-foreground">
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => handleToggleUser(user)}
                      aria-label={`Toggle ${user.name} status`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {safeUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Users"
        description={`Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        variant="destructive"
      />

      <ConfirmationDialog
        open={toggleDialogOpen}
        onOpenChange={setToggleDialogOpen}
        title="Change User Status"
        description={`Are you sure you want to ${userToToggle?.isActive ? "deactivate" : "activate"} ${userToToggle?.name}?`}
        confirmText={userToToggle?.isActive ? "Deactivate" : "Activate"}
        onConfirm={confirmToggle}
      />
    </div>
  );
};
