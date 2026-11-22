import { useState } from "react";
import { Armchair, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/screen-states";
import { getApiErrorMessage } from "@/lib/api-error-message";
import type { SpotDTO } from "@/cases/spots/dtos/spot.dto";
import { useDeleteSpot, useSpots } from "@/cases/spots/hooks/use-spots";
import { SpotTable } from "@/cases/spots/components/spot-table";
import { SpotFormDialog } from "@/cases/spots/components/spot-form-dialog";

// Tela de Mesas: listagem, cadastro, edição e exclusão
export function SpotsPage() {
  const { data: spots = [], isLoading, isError, error, refetch } = useSpots();
  const deleteMutation = useDeleteSpot();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SpotDTO | null>(null);
  const [toDelete, setToDelete] = useState<SpotDTO | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(spot: SpotDTO) {
    setEditing(spot);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!toDelete) return;

    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(`Mesa "${toDelete.name}" excluída.`);
        setToDelete(null);
      },
      onError: (error) => {
        toast.error("Não foi possível excluir a mesa.", { description: getApiErrorMessage(error) });
      },
    });
  }

  // Escolhe o que mostrar: carregando, erro, lista vazia ou tabela
  function renderContent() {
    if (isLoading) return <LoadingState label="Carregando mesas" />;
    if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
    if (spots.length === 0) {
      return (
        <EmptyState
          icon={Armchair}
          title="Nenhuma mesa cadastrada"
          description="Cadastre as mesas do salão para que os clientes possam fazer pedidos."
          action={
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Nova mesa
            </Button>
          }
        />
      );
    }

    return <SpotTable spots={spots} onEdit={openEdit} onDelete={setToDelete} />;
  }

  return (
    <>
      <PageTitle
        title="Mesas"
        description="Mesas do salão disponíveis para pedidos."
        actions={
          spots.length > 0 && (
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Nova mesa
            </Button>
          )
        }
      />

      {renderContent()}

      <SpotFormDialog open={formOpen} onOpenChange={setFormOpen} spot={editing} />

      <ConfirmDeleteDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir mesa?"
        description={`A mesa "${toDelete?.name ?? ""}" será removida. Mesas com comandas registradas não podem ser excluídas.`}
        isPending={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
