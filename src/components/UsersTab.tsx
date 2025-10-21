import { useState } from "react";
import { User } from "@/types";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "./ConfirmationDialog";

interface UsersTabProps {
  users: User[];
  onToggleActive: (userId: string) => Promise<void>;
  onDeleteUsers: (userIds: string[]) => void;
}

export const UsersTab = ({ users, onToggleActive, onDeleteUsers }: UsersTabProps) => {
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleUser = (user: User) => {
    setUserToToggle(user);
    setToggleDialogOpen(true);
  };

  const confirmToggle = async () => {
    if (!userToToggle) return;
    
    setIsToggling(true);
    try {
      await onToggleActive(userToToggle.id);
      toast({
        title: "User status updated",
        description: `${userToToggle.display_name} is now ${userToToggle.active ? "inactive" : "active"}`,
      });
      setToggleDialogOpen(false);
      setUserToToggle(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Users Management</h2>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.active ? "default" : "secondary"}>
                    {user.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => handleToggleUser(user)}
                      aria-label={`Toggle ${user.display_name} status`}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}

      <ConfirmationDialog
        open={toggleDialogOpen}
        onOpenChange={setToggleDialogOpen}
        title="Change User Status"
        description={`Are you sure you want to ${userToToggle?.active ? "deactivate" : "activate"} ${userToToggle?.display_name}?`}
        confirmText={isToggling ? "Updating..." : (userToToggle?.active ? "Deactivate" : "Activate")}
        onConfirm={confirmToggle}
        disabled={isToggling}
      />
    </div>
  );
};
