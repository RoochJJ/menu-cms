import { ClipboardList } from "lucide-react";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/screen-states";
import { useOrders } from "@/cases/orders/hooks/use-orders";
import { OrderKanbanBoard } from "@/cases/orders/components/kanban/order-kanban-board";

export function KanbanPage() {
  // Só pedidos de comandas abertas: pedidos de comandas fechadas já saíram da operação
  const { data: orders = [], isLoading, isError, error, refetch } = useOrders({ guestCheckStatus: "OPENED" });

  function renderContent() {
    if (isLoading) return <LoadingState label="Carregando pedidos" />;
    if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
    if (orders.length === 0) {
      return (
        <EmptyState
          icon={ClipboardList}
          title="Nenhum pedido em andamento"
          description="Os pedidos das comandas abertas aparecem aqui assim que forem feitos."
        />
      );
    }

    return <OrderKanbanBoard orders={orders} />;
  }

  return (
    <>
      <PageTitle title="Kanban de pedidos" description="Arraste o cartão para outra coluna para alterar o status do pedido." />
      {renderContent()}
    </>
  );
}
