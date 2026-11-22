import type { ProductDTO } from "@/cases/products/dtos/product.dto";
import type { SpotDTO } from "@/cases/spots/dtos/spot.dto";

export const ORDER_STATUSES = ["NEW", "PREPARING", "READY", "DELIVERED"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItemDTO {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  product: Omit<ProductDTO, "category">;
}

export interface OrderDTO {
  id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItemDTO[];
  // Presente quando o pedido é buscado pela rota /orders
  guestCheck?: {
    id: string;
    createdAt: string;
    status: string;
    spot: SpotDTO;
  };
}
