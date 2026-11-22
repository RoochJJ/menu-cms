import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../services/product.service";
import type { ProductInput } from "../dtos/product.dto";

// Leitura: lista os produtos (todos ou só de uma categoria)
export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ["products", "list", categoryId ?? null],
    queryFn: () => ProductService.listAll(categoryId),
  });
}

// Leitura: busca um produto pelo id
export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => ProductService.findOne(id),
    enabled: Boolean(id),
  });
}

// Gravação: cadastra e recarrega as listas de produtos
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductInput) => ProductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Gravação: edita e recarrega as listas de produtos
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductInput> }) =>
      ProductService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Gravação: exclui e recarrega as listas de produtos
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
