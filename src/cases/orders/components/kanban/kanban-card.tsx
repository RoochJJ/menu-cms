import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/merge-classes";
import { formatDateTime } from "@/lib/format-values";
import type { OrderDTO } from "../../dtos/order.dto";

type KanbanCardProps = {
  order: OrderDTO;
  // true quando o cartão é a "cópia" que segue o mouse (DragOverlay)
  overlay?: boolean;
};

// Conteúdo do cartão: mesa, data/hora e itens
export function KanbanCardContent({ order, overlay, dragging }: KanbanCardProps & { dragging?: boolean }) {
  return (
    <article
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm",
        // Enquanto arrasta, o lugar de origem vira um contorno tracejado
        dragging && "border-2 border-dashed border-muted-foreground/40 bg-transparent shadow-none [&>*]:invisible",
        overlay && "rotate-2 cursor-grabbing shadow-lg ring-2 ring-primary/30"
      )}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="font-semibold">{order.guestCheck?.spot.name ?? "Mesa"}</span>
        <time dateTime={order.createdAt} className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {formatDateTime(order.createdAt)}
        </time>
      </header>

      <ul className="flex flex-col gap-0.5 text-sm">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity}x {item.product.name}
          </li>
        ))}
      </ul>
    </article>
  );
}

// Cartão arrastável: o id do draggable é o id do pedido
export function KanbanCard({ order }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    data: { order },
  });

  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      aria-label={`Pedido da ${order.guestCheck?.spot.name ?? "mesa"}, ${formatDateTime(order.createdAt)}`}
      className="cursor-grab touch-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <KanbanCardContent order={order} dragging={isDragging} />
    </li>
  );
}
