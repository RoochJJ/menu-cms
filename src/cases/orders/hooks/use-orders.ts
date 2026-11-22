import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderService, type OrderFilters } from "../services/order.service";
import type { OrderStatus } from "../dtos/order.dto";

// Leitura: lista os pedidos (com filtros opcionais, ex.: só de comandas abertas)
export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ["orders", "list", filters],
    queryFn: () => OrderService.listAll(filters),
  });
}

// Gravação: altera o status do pedido na API
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => OrderService.updateStatus(id, status),
    onSuccess: () => {
      // Os pedidos aparecem nas comandas e nas listas de pedidos: recarrega as duas
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
