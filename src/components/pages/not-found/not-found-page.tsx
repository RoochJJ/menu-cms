import { Link } from "react-router-dom";
import { MapPinOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/screen-states";

// Tela para endereços que não existem no CMS
export function NotFoundPage() {
  return (
    <EmptyState
      icon={MapPinOff}
      title="Página não encontrada"
      description="O endereço acessado não existe no CMS. Use o menu para escolher uma área."
      action={
        <Link to="/" className={buttonVariants({ variant: "outline" })}>
          Ir para o início
        </Link>
      }
    />
  );
}
