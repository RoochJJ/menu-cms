import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/screen-states";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { useCategories } from "@/cases/categories/hooks/use-category";
import { CategorySelect } from "@/cases/categories/components/category-select";
import type { ProductDTO } from "@/cases/products/dtos/product.dto";
import { useDeleteProduct, useProducts } from "@/cases/products/hooks/use-products";
import { ProductTable } from "@/cases/products/components/product-table";
import { ProductFormDialog } from "@/cases/products/components/product-form-dialog";

// Tela de Produtos: listagem com filtro por categoria, cadastro, edição e exclusão
export function ProductsPage() {
  // O filtro fica na URL (?categoryId=...), como no menu-frontend da aula
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? undefined;

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading, isError, error, refetch } = useProducts(categoryId);
  const deleteMutation = useDeleteProduct();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDTO | null>(null);
  const [toDelete, setToDelete] = useState<ProductDTO | null>(null);

  const selectedCategory = categories.find((category) => category.id === categoryId);

  // Troca o filtro: com categoria, coloca ?categoryId na URL; sem, limpa
  function changeFilter(value: string | null) {
    setSearchParams(value ? { categoryId: value } : {});
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: ProductDTO) {
    setEditing(product);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!toDelete) return;

    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(`Produto "${toDelete.name}" excluído.`);
        setToDelete(null);
      },
      onError: (error) => {
        toast.error("Não foi possível excluir o produto.", { description: getApiErrorMessage(error) });
      },
    });
  }

  // Escolhe o que mostrar: carregando, erro, lista vazia ou tabela
  function renderContent() {
    if (isLoading) return <LoadingState label="Carregando produtos" />;
    if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
    if (products.length === 0) {
      return categoryId ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Nenhum produto nesta categoria"
          description={`Ainda não há produtos em "${selectedCategory?.name ?? "categoria selecionada"}".`}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => changeFilter(null)}>
                Ver todas as categorias
              </Button>
              <Button onClick={openCreate}>
                <Plus data-icon="inline-start" />
                Novo produto
              </Button>
            </div>
          }
        />
      ) : (
        <EmptyState
          icon={UtensilsCrossed}
          title="Nenhum produto cadastrado"
          description="Cadastre o primeiro produto do cardápio."
          action={
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Novo produto
            </Button>
          }
        />
      );
    }

    return <ProductTable products={products} onEdit={openEdit} onDelete={setToDelete} />;
  }

  return (
    <>
      <PageTitle
        title="Produtos"
        description="Itens do cardápio, com preço, categoria e indicadores."
        actions={
          <Button onClick={openCreate}>
            <Plus data-icon="inline-start" />
            Novo produto
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="products-filter" className="text-sm font-medium">
            Categoria
          </label>
          <CategorySelect
            id="products-filter"
            categories={categories}
            value={categoryId ?? null}
            allLabel="Todas as categorias"
            onValueChange={changeFilter}
            className="w-60"
          />
        </div>
        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {products.length === 1 ? "1 produto" : `${products.length} produtos`}
          </p>
        )}
      </div>

      {renderContent()}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
        defaultCategoryId={categoryId ?? null}
      />

      <ConfirmDeleteDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir produto?"
        description={`O produto "${toDelete?.name ?? ""}" será removido do cardápio.`}
        isPending={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
