import { ReceiptText } from "lucide-react";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/screen-states";
import { formatPrice } from "@/lib/format-values";
import { useOpenGuestChecks } from "@/cases/guest-checks/hooks/use-guest-checks";
import { GuestCheckTable } from "@/cases/guest-checks/components/guest-check-table";

export function GuestChecksPage() {
  const { data: guestChecks = [], isLoading, isError, error, refetch } = useOpenGuestChecks();
  const openTotal = guestChecks.reduce((sum, guestCheck) => sum + guestCheck.total, 0);

  function renderContent() {
    if (isLoading) return <LoadingState label="Carregando comandas" />;
    if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
    if (guestChecks.length === 0) {
      return (
        <EmptyState
          icon={ReceiptText}
          title="Nenhuma comanda aberta"
          description="Uma comanda é aberta automaticamente quando a mesa faz o primeiro pedido."
        />
      );
    }

    return <GuestCheckTable guestChecks={guestChecks} />;
  }

  return (
    <>
      <PageTitle
        title="Comandas em aberto"
        description="Mesas com consumo em andamento. A lista é atualizada automaticamente."
      />

      {!isLoading && !isError && guestChecks.length > 0 && (
        <dl className="mb-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Comandas abertas</dt>
            <dd className="font-semibold tabular-nums">{guestChecks.length}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Total em aberto</dt>
            <dd className="font-semibold tabular-nums">{formatPrice(openTotal)}</dd>
          </div>
        </dl>
      )}

      {renderContent()}
    </>
  );
}
