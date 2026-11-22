import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/merge-classes";
import { ORDER_STATUSES, type OrderStatus } from "../dtos/order.dto";
import { ORDER_STATUS_LABELS } from "../order-status-labels";

type OrderStatusSelectProps = {
  id?: string;
  value: OrderStatus;
  onValueChange: (status: OrderStatus) => void;
  disabled?: boolean;
  className?: string;
};

const items = ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status].label }));

// Select para alterar o status do pedido (transições livres, como no backend)
export function OrderStatusSelect({ id, value, onValueChange, disabled, className }: OrderStatusSelectProps) {
  return (
    <Select
      items={items}
      value={value}
      disabled={disabled}
      onValueChange={(next) => next && onValueChange(next as OrderStatus)}
    >
      <SelectTrigger id={id} size="sm" className={cn("w-40", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", ORDER_STATUS_LABELS[item.value].dotClass)}
            />
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
