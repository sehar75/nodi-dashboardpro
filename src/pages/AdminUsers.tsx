import { useEffect, useState } from "react";
import { UsersTab } from "@/components/UsersTab";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { User } from "@/types";
import { backendUsersApi } from "@/services/backendApi";

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendUsersApi.getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (userId: string): Promise<void> => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    await backendUsersApi.toggleUserStatus(userId, !user.active);
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === userId ? { ...u, active: !u.active } : u)
    );
  };

  const handleDeleteUsers = async (userIds: string[]) => {
    await backendUsersApi.deleteUsers(userIds);
    setUsers(prevUsers => prevUsers.filter(u => !userIds.includes(u.id)));
  };

  if (loading) return <LoadingSpinner message="Loading users..." />;

  return (
    <UsersTab 
      users={users} 
      onToggleActive={handleToggleActive} 
      onDeleteUsers={handleDeleteUsers} 
    />
  );
};

export default AdminUsers;


