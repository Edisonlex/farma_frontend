import { UserCard } from "./UserCard";


interface UserListProps {
  users: any[];
  currentUser: any;
  onEditUser: (user: any) => void;
  onDeleteUser: (user: any) => void;
  roleColors: Record<string, string>;
  roleLabels: Record<string, string>;
}

export function UserList({
  users,
  currentUser,
  onEditUser,
  onDeleteUser,
  roleColors,
  roleLabels,
}: UserListProps) {
  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          currentUser={currentUser}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          
          
        />
      ))}
    </div>
  );
}
