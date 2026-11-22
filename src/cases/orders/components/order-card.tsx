import { toast } from "sonner";
import { Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice, formatTime } from "@/lib/format-values";
import { getApiErrorMessage } from "@/lib/api-error-message";
import type { OrderDTO, OrderStatus } from "../dtos/order.dto";
import { ORDER_STATUS_LABELS } from "../order-status-labels";
import { useUpdateOrderStatus } from "../hooks/use-orders";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderStatusSelect } from "./order-status-select";

type OrderCardProps = {
  order: OrderDTO;
  label: string;
};

// Pedido com seus itens, total e controle de status
export function OrderCard({ order, label }: OrderCardProps) {
  const updateStatus = useUpdateOrderStatus();
  const selectId = `order-status-${order.id}`;

  function handleStatusChange(status: OrderStatus) {
    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: () => {
          toast.success(`${label}: status alterado para "${ORDER_STATUS_LABELS[status].label}".`);
        },
        onError: (error) => {
          toast.error("Não foi possível alterar o status do pedido.", { description: getApiErrorMessage(error) });
        },
      }
    );
  }

  return (
    <section aria-labelledby={`${selectId}-title`} className="overflow-hidden rounded-xl border bg-card">
      <header className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id={`${selectId}-title`} className="font-semibold">
            {label}
          </h2>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" aria-hidden="true" />
            {formatTime(order.createdAt)}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex items-center gap-2">
          {updateStatus.isPending && <Spinner className="text-muted-foreground" />}
          <label htmlFor={selectId} className="text-sm text-muted-foreground">
            Alterar status
          </label>
          <OrderStatusSelect
            id={selectId}
            value={order.status}
            disabled={updateStatus.isPending}
            onValueChange={handleStatusChange}
          />
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Produto</TableHead>
            <TableHead className="w-24 text-right">Qtd.</TableHead>
            <TableHead className="w-32 text-right">Preço unit.</TableHead>
            <TableHead className="w-32 pr-4 text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="pl-4 font-medium">{item.product.name}</TableCell>
              <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
              <TableCell className="text-right tabular-nums">{formatPrice(item.price)}</TableCell>
              <TableCell className="pr-4 text-right tabular-nums">{formatPrice(item.subtotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="pl-4 text-right font-medium">
              Total do pedido
            </TableCell>
            <TableCell className="pr-4 text-right font-semibold tabular-nums">{formatPrice(order.total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
}
