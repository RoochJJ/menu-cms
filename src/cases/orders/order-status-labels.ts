import type { OrderStatus } from "./dtos/order.dto";

// Rótulo (texto na tela) e cores de cada status de pedido
export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  NEW: {
    label: "Novo",
    badgeClass: "border-status-new/30 bg-status-new/10 text-status-new",
    dotClass: "bg-status-new",
  },
  PREPARING: {
    label: "Em preparo",
    badgeClass: "border-status-preparing/30 bg-status-preparing/10 text-status-preparing",
    dotClass: "bg-status-preparing",
  },
  READY: {
    label: "Pronto",
    badgeClass: "border-status-ready/30 bg-status-ready/10 text-status-ready",
    dotClass: "bg-status-ready",
  },
  DELIVERED: {
    label: "Entregue",
    badgeClass: "border-status-delivered/30 bg-status-delivered/10 text-status-delivered",
    dotClass: "bg-status-delivered",
  },
};
