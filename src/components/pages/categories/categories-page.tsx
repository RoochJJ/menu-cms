import { useState } from "react";
import { Plus, Tags } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/screen-states";
import { getApiErrorMessage } from "@/lib/api-error-message";
import type { CategoryDTO } from "@/cases/categories/dtos/category.dto";
import { useCategories, useDeleteCategory } from "@/cases/categories/hooks/use-category";
import { CategoryTable } from "@/cases/categories/components/category-table";
import { CategoryFormDialog } from "@/cases/categories/components/category-form-dialog";

// Tela de Categorias: listagem, cadastro, edição e exclusão
export function CategoriesPage() {
  const { data: categories = [], isLoading, isError, error, refetch } = useCategories();
  const deleteMutation = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDTO | null>(null);
  const [toDelete, setToDelete] = useState<CategoryDTO | null>(null);

  // Sugere a próxima ordem livre ao cadastrar
  const nextOrder = categories.reduce((max, category) => Math.max(max, category.displayOrder), 0) + 1;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(category: CategoryDTO) {
    setEditing(category);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!toDelete) return;

    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(`Categoria "${toDelete.name}" excluída.`);
        setToDelete(null);
      },
      onError: (error) => {
        toast.error("Não foi possível excluir a categoria.", { description: getApiErrorMessage(error) });
      },
    });
  }

  // Escolhe o que mostrar: carregando, erro, lista vazia ou tabela
  function renderContent() {
    if (isLoading) return <LoadingState label="Carregando categorias" />;
    if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
    if (categories.length === 0) {
      return (
        <EmptyState
          icon={Tags}
          title="Nenhuma categoria cadastrada"
          description="Cadastre a primeira categoria para começar a montar o cardápio."
          action={
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Nova categoria
            </Button>
          }
        />
      );
    }

    return <CategoryTable categories={categories} onEdit={openEdit} onDelete={setToDelete} />;
  }

  return (
    <>
      <PageTitle
        title="Categorias"
        description="Organize as seções do cardápio e a ordem em que aparecem."
        actions={
          categories.length > 0 && (
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Nova categoria
            </Button>
          )
        }
      />

      {renderContent()}

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} nextOrder={nextOrder} />

      <ConfirmDeleteDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir categoria?"
        description={`A categoria "${toDelete?.name ?? ""}" será removida. Os produtos dela ficarão sem categoria.`}
        isPending={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}