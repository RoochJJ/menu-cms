import { api } from "@/lib/axios";
import type { OrderDTO, OrderStatus } from "../dtos/order.dto";

const ENDPOINT = "/orders";

export type OrderFilters = {
  status?: OrderStatus;
  guestCheckId?: string;
  guestCheckStatus?: "OPENED" | "CLOSED" | "CANCELED";
};

export const OrderService = {
  async listAll(filters: OrderFilters = {}): Promise<OrderDTO[]> {
    const result = await api.get<OrderDTO[]>(ENDPOINT, { params: filters });
    return result.data;
  },

  async findOne(id: string): Promise<OrderDTO> {
    const result = await api.get<OrderDTO>(`${ENDPOINT}/${id}`);
    return result.data;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
    const result = await api.patch<OrderDTO>(`${ENDPOINT}/${id}/status`, { status });
    return result.data;
  },
};
