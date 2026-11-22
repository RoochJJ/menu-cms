import type { SpotDTO } from "@/cases/spots/dtos/spot.dto";
import type { OrderDTO } from "@/cases/orders/dtos/order.dto";

export type GuestCheckStatus = "OPENED" | "CLOSED" | "CANCELED";

export interface GuestCheckDTO {
  id: string;
  createdAt: string;
  status: GuestCheckStatus;
  spot: SpotDTO;
  // Valor acumulado (soma dos pedidos), calculado pela API
  total: number;
  // Presente apenas no detalhe da comanda
  orders?: OrderDTO[];
}
