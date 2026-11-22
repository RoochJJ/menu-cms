import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/merge-classes";
import type { OrderStatus } from "../dtos/order.dto";
import { ORDER_STATUS_LABELS } from "../order-status-labels";

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const config = ORDER_STATUS_LABELS[status];

  return (
    <Badge variant="outline" className={cn(config.badgeClass, className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </Badge>
  );
}
