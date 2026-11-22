import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpotService } from "../services/spot.service";
import type { SpotInput } from "../dtos/spot.dto";

// Leitura: lista todas as mesas
export function useSpots() {
  return useQuery({
    queryKey: ["spots"],
    queryFn: SpotService.listALL,
  });
}

// Leitura: busca uma mesa pelo id
export function useSpot(id: string) {
  return useQuery({
    queryKey: ["spots", id],
    queryFn: () => SpotService.findOne(id),
    enabled: !!id,
  });
}

// Gravação: cadastra e recarrega a lista de mesas
export function useCreateSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SpotInput) => SpotService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
    },
  });
}

// Gravação: edita e recarrega mesas e comandas (as comandas mostram o nome da mesa)
export function useUpdateSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SpotInput> }) => SpotService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
      queryClient.invalidateQueries({ queryKey: ["guest-checks"] });
    },
  });
}

// Gravação: exclui e recarrega a lista de mesas
export function useDeleteSpot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SpotService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
    },
  });
}
