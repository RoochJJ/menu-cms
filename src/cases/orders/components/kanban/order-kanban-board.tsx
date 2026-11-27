import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { ORDER_STATUSES, type OrderDTO, type OrderStatus } from "../../dtos/order.dto";
import { ORDER_STATUS_LABELS } from "../../order-status-labels";
import { useUpdateOrderStatus } from "../../hooks/use-orders";
import { KanbanColumn } from "./kanban-column";
import { KanbanCardContent } from "./kanban-card";

type OrderKanbanBoardProps = {
  orders: OrderDTO[];
};

export function OrderKanbanBoard({ orders }: OrderKanbanBoardProps) {
  // Mesma mutation usada no detalhe da comanda: PATCH /orders/:id/status + invalidateQueries
  const updateStatus = useUpdateOrderStatus();

  // Pedido que está sendo arrastado (para desenhar a cópia que segue o mouse)
  const [activeOrder, setActiveOrder] = useState<OrderDTO | null>(null);

  const sensors = useSensors(
    // Só começa a arrastar depois de mover 5px, para um clique não virar arraste
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // Permite mover pelo teclado: Tab no cartão, Espaço para pegar, setas e Espaço para soltar
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveOrder(event.active.data.current?.order ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveOrder(null);

    const order: OrderDTO | undefined = event.active.data.current?.order;
    // O id da coluna onde o cartão foi solto é o próprio status (NEW, PREPARING...)
    const newStatus = event.over?.id as OrderStatus | undefined;

    // Soltou fora de uma coluna ou na mesma coluna: não chama a API
    if (!order || !newStatus || newStatus === order.status) return;

    updateStatus.mutate(
      { id: order.id, status: newStatus },
      {
        onSuccess: () => toast.success(`Pedido movido para "${ORDER_STATUS_LABELS[newStatus].label}".`),
        onError: (error) =>
          toast.error("Não foi possível alterar o status do pedido.", { description: getApiErrorMessage(error) }),
      }
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveOrder(null)}
    >
      {/* Uma coluna por status; em telas estreitas o quadro rola na horizontal */}
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[56rem] grid-cols-4 gap-4">
          {ORDER_STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} orders={orders.filter((order) => order.status === status)} />
          ))}
        </div>
      </div>

      {/* Cópia do cartão que acompanha o ponteiro enquanto arrasta */}
      <DragOverlay>{activeOrder && <KanbanCardContent order={activeOrder} overlay />}</DragOverlay>
    </DndContext>
  );
}
