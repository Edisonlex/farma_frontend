import { UserCard } from "./UserCard";
import { useEffect, useMemo, useState } from "react";
import { Pager } from "@/components/shared/Pager";


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
  const [page, setPage] = useState(1);
  const pageSize = 6;
  useEffect(() => {
    setPage(1);
  }, [users]);
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, page]);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, users.length);
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    const showLeftEllipsis = page > 4;
    const showRightEllipsis = page < totalPages - 3;
    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);
    if (showLeftEllipsis) pages.push("ellipsis");
    for (let p = startPage; p <= endPage; p++) pages.push(p);
    if (showRightEllipsis) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {currentItems.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            currentUser={currentUser}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
          />
        ))}
      </div>
      <Pager total={users.length} page={page} pageSize={pageSize} onChange={setPage} />
    </div>
  );
}
