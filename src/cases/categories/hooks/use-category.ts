import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "../services/category.service";
import type { CategoryInput } from "../dtos/category.dto";

// Leitura: lista todas as categorias
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.listALL,
  });
}

// Leitura: busca uma categoria pelo id
export function useCategory(id: string) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => CategoryService.findOne(id),
    enabled: !!id,
  });
}

// Gravação: cadastra e, ao terminar, recarrega a lista
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryInput) => CategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// Gravação: edita e recarrega categorias e produtos (os produtos mostram o nome da categoria)
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryInput> }) =>
      CategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Gravação: exclui e recarrega categorias e produtos
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}