import { useEffect, useState } from "react";
import { UsersTab } from "@/components/UsersTab";
import { User } from "@/types";
import { backendUsersApi } from "@/services/backendApi";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await backendUsersApi.getAllUsers();
        console.log("Backend API Response:", data);
        console.log("Data type:", typeof data);
        console.log("Is array:", Array.isArray(data));
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Backend API returned non-array data:", data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error loading users from backend:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleToggleActive = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await backendUsersApi.toggleUserStatus(userId, !user.isActive);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, isActive: !user.isActive, status: !user.isActive ? "active" : "inactive" }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleDeleteUsers = async (userIds: string[]) => {
    try {
      await backendUsersApi.deleteUsers(userIds);
      setUsers((prevUsers) => prevUsers.filter((user) => !userIds.includes(user.id)));
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <UsersTab users={users} onToggleActive={handleToggleActive} onDeleteUsers={handleDeleteUsers} />
  );
};

export default AdminUsers;


