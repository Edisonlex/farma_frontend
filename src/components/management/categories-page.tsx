// components/management/categories-page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { Tags } from "lucide-react";
import { useInventory } from "@/context/inventory-context";
import { CategoryStats } from "./CategoryStats";
import { CategorySearch } from "./CategorySearch";
import { CategoryList } from "./CategoryList";
import { CategoryDialog } from "./CategoryDialog";


// Función para normalizar texto (eliminar tildes y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export function CategoriesPage() {
  const { categories, deleteCategory } = useInventory();
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  // Búsqueda mejorada con normalización de texto
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;

    const normalizedSearch = normalizeText(search);

    return categories.filter((cat) => {
      const normalizedName = normalizeText(cat.name || "");
      const normalizedDescription = normalizeText(cat.description || "");

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedDescription.includes(normalizedSearch)
      );
    });
  }, [categories, search]);

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleDeleteClick = (categoryData: any) => {
    setCategoryToDelete(categoryData);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleSaveCategory = (categoryData: any) => {
    setEditingCategory(null);
    setShowDialog(false);
  };

  const stats = {
    total: categories.length,
    withDescription: categories.filter((cat) => cat.description).length,
    withoutDescription: categories.filter((cat) => !cat.description).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Gestión de Categorías"
        subtitle={`${stats.total} categorías registradas`}
        icon={<Tags className="h-5 w-5 text-white" />}
      />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 space-y-6">
            <CategoryStats stats={stats} />

            <CategorySearch
              search={search}
              onSearchChange={setSearch}
              onNewCategory={() => setShowDialog(true)}
            />

            <CategoryList
              categories={filteredCategories}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteClick}
            />

            <CategoryDialog
              open={showDialog}
              onOpenChange={setShowDialog}
              category={editingCategory}
              onSave={handleSaveCategory}
            />

            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onClose={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              itemName={categoryToDelete?.name}
              title="¿Eliminar categoría?"
              description="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
