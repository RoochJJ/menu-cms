import { useQuery } from "@tanstack/react-query";
import { GuestCheckService } from "../services/guest-check.service";

// Atualiza a cada 15 segundos para acompanhar a operação sem recarregar a página
const REFRESH_INTERVAL = 15_000;

// Leitura: lista só as comandas abertas (status OPENED)
export function useOpenGuestChecks() {
  return useQuery({
    queryKey: ["guest-checks", "list", "OPENED"],
    queryFn: () => GuestCheckService.listAll("OPENED"),
    refetchInterval: REFRESH_INTERVAL,
  });
}

// Leitura: busca uma comanda com os pedidos dela
export function useGuestCheck(id: string) {
  return useQuery({
    queryKey: ["guest-checks", "detail", id],
    queryFn: () => GuestCheckService.findOne(id),
    enabled: !!id,
    refetchInterval: REFRESH_INTERVAL,
  });
}
