import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/merge-classes";
import type { OrderDTO, OrderStatus } from "../../dtos/order.dto";
import { OrderStatusBadge } from "../order-status-badge";
import { ORDER_STATUS_LABELS } from "../../order-status-labels";
import { KanbanCard } from "./kanban-card";

type KanbanColumnProps = {
  status: OrderStatus;
  orders: OrderDTO[];
};

// Coluna do quadro = área onde se pode soltar cartões. O id do droppable é o próprio status.
export function KanbanColumn({ status, orders }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-label={`Coluna ${ORDER_STATUS_LABELS[status].label}`}
      className={cn(
        "flex min-h-[28rem] min-w-0 flex-col gap-3 rounded-xl border bg-card/60 p-3 transition-colors",
        isOver && "border-primary bg-primary/5 ring-2 ring-primary/20"
      )}
    >
      {/* Cabeçalho: status em pílula à esquerda e quantidade à direita */}
      <header className="flex items-center justify-between px-1">
        <OrderStatusBadge status={status} />
        <span className="text-sm tabular-nums text-muted-foreground" aria-label={`${orders.length} pedidos`}>
          {orders.length}
        </span>
      </header>

      {orders.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Nenhum pedido</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <KanbanCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </section>
  );
}
