import { Badge } from "@/components/ui/badge";

// Selo de situação: "Ativo" ou "Inativo" (ou "Ativa"/"Inativa" com feminine)
export function ActiveBadge({ active, feminine = false }: { active: boolean; feminine?: boolean }) {
  const label = active ? (feminine ? "Ativa" : "Ativo") : feminine ? "Inativa" : "Inativo";

  return (
    <Badge variant={active ? "secondary" : "outline"} className={active ? "" : "text-muted-foreground"}>
      <span
        aria-hidden="true"
        className={active ? "size-1.5 rounded-full bg-status-ready" : "size-1.5 rounded-full bg-muted-foreground/50"}
      />
      {label}
    </Badge>
  );
}