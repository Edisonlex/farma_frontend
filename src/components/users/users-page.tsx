"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useUsers } from "@/hooks/use-users";
import { UserDialog } from "./user-dialog";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { Users } from "lucide-react";
import { UserStats } from "./user/UserStats";
import { UserSearch } from "./user/UserSearch";
import { UserList } from "./user/UserList";


const roleColors = {
  administrador: "bg-red-100 text-red-800",
  farmaceutico: "bg-blue-100 text-blue-800",
  tecnico: "bg-green-100 text-green-800",
};

const roleLabels = {
  administrador: "Administrador",
  farmaceutico: "Farmacéutico",
  tecnico: "Técnico",
};

// Función para normalizar texto (eliminar tildes y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export function UsersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const { users, addUser, updateUser, deleteUser, stats } = useUsers();

  // Búsqueda mejorada con normalización de texto
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    const normalizedSearch = normalizeText(search);

    return users.filter((u) => {
      const normalizedName = normalizeText(u.name || "");
      const normalizedEmail = normalizeText(u.email || "");

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedEmail.includes(normalizedSearch)
      );
    });
  }, [users, search]);

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowDialog(true);
  };

  const handleDeleteClick = (userData: any) => {
    setUserToDelete(userData);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      if (user && userToDelete.id === user.id) {
        alert("No puedes eliminar al usuario actualmente autenticado");
        setShowDeleteModal(false);
        setUserToDelete(null);
        return;
      }
      deleteUser(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }
    setEditingUser(null);
    setShowDialog(false);
  };

  

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Gestión de Usuarios"
        subtitle={`${stats.total} usuarios registrados`}
        icon={<Users className="h-5 w-5 text-primary" />}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 space-y-6">
            <UserStats stats={stats} />

            <UserSearch
              search={search}
              onSearchChange={setSearch}
              onNewUser={() => setShowDialog(true)}
              userRole={user?.role}
            />

            <UserList
              users={filteredUsers}
              currentUser={user}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteClick}
              roleColors={roleColors}
              roleLabels={roleLabels}
            />

            <UserDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              user={editingUser}
              onSave={handleSaveUser}
            />

            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              itemName={userToDelete?.name}
              title="¿Eliminar usuario?"
              description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
