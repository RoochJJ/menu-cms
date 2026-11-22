import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/screen-states";
import { formatPrice, formatDateTime } from "@/lib/format-values";
import { useGuestCheck } from "@/cases/guest-checks/hooks/use-guest-checks";
import type { GuestCheckStatus } from "@/cases/guest-checks/dtos/guest-check.dto";
import { OrderCard } from "@/cases/orders/components/order-card";

const GUEST_CHECK_STATUS_LABEL: Record<GuestCheckStatus, string> = {
  OPENED: "Aberta",
  CLOSED: "Fechada",
  CANCELED: "Cancelada",
};

export function GuestCheckDetailPage() {
  const { id = "" } = useParams();
  const { data: guestCheck, isLoading, isError, error, refetch } = useGuestCheck(id);
  const orders = guestCheck?.orders ?? [];

  return (
    <>
      <Link to="/guest-checks" className={buttonVariants({ variant: "ghost", size: "sm", className: "-ml-2 mb-4" })}>
        <ArrowLeft data-icon="inline-start" />
        Comandas em aberto
      </Link>

      {isLoading && <LoadingState rows={4} label="Carregando comanda" />}
      {isError && <ErrorState error={error} title="Não foi possível carregar a comanda" onRetry={() => refetch()} />}

      {guestCheck && (
        <>
          <header className="mb-6 flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{guestCheck.spot.name}</h1>
                <Badge variant={guestCheck.status === "OPENED" ? "secondary" : "outline"}>
                  Comanda {GUEST_CHECK_STATUS_LABEL[guestCheck.status].toLowerCase()}
                </Badge>
              </div>
              <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                <span>Aberta em {formatDateTime(guestCheck.createdAt)}</span>
                <span>{orders.length === 1 ? "1 pedido" : `${orders.length} pedidos`}</span>
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-muted-foreground">Total acumulado</p>
              <p className="text-2xl font-bold tabular-nums">{formatPrice(guestCheck.total)}</p>
            </div>
          </header>

          {orders.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="Nenhum pedido nesta comanda"
              description="Os pedidos feitos pela mesa aparecem aqui."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order, index) => (
                <OrderCard key={order.id} order={order} label={`Pedido ${index + 1}`} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
