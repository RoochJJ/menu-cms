import type { ReactNode } from "react";
import { CircleAlert, RotateCw, type LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getApiErrorMessage } from "@/lib/api-error-message";

// Carregando: linhas cinzas no lugar da lista enquanto os dados chegam
export function LoadingState({ rows = 5, label = "Carregando..." }: { rows?: number; label?: string }) {
  return (
    <div role="status" aria-label={label} className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Erro: mostra a mensagem da API e um botão para tentar de novo
export function ErrorState({
  error,
  title = "Não foi possível carregar os dados",
  onRetry,
}: {
  error: unknown;
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{getApiErrorMessage(error)}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            <RotateCw data-icon="inline-start" />
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Lista vazia: explica o que falta e oferece a ação principal
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Empty className="rounded-xl border border-dashed bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}