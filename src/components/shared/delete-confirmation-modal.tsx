// src/components/shared/delete-confirmation-modal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  title = "¿Eliminar elemento?",
  description = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  type = "danger",
}: DeleteConfirmationModalProps) {
  // Prevenir el scroll del cuerpo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Colores según el tipo
  const typeColors = {
    danger: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo oscuro con transición */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border border-border z-60"
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icono de advertencia */}
            <div className="flex justify-center mb-4">
              <div className={`p-3 ${typeColors[type].bg} rounded-full`}>
                <AlertTriangle className={`h-8 w-8 ${typeColors[type].text}`} />
              </div>
            </div>

            {/* Contenido */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {itemName
                  ? `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`
                  : description}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded-md text-white ${typeColors[type].button} transition-colors`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
