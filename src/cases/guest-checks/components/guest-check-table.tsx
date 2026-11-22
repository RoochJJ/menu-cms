import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice, formatDateTime } from "@/lib/format-values";
import type { GuestCheckDTO } from "../dtos/guest-check.dto";

export function GuestCheckTable({ guestChecks }: { guestChecks: GuestCheckDTO[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Mesa</TableHead>
            <TableHead>Aberta em</TableHead>
            <TableHead className="text-right">Total acumulado</TableHead>
            <TableHead className="w-40 pr-4 text-right">
              <span className="sr-only">Ações</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guestChecks.map((guestCheck) => (
            <TableRow key={guestCheck.id}>
              <TableCell className="pl-4 font-medium">{guestCheck.spot.name}</TableCell>
              <TableCell className="tabular-nums">{formatDateTime(guestCheck.createdAt)}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatPrice(guestCheck.total)}
              </TableCell>
              <TableCell className="pr-4 text-right">
                <Link
                  to={`/guest-checks/${guestCheck.id}`}
                  aria-label={`Ver pedidos da ${guestCheck.spot.name}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Ver pedidos
                  <ChevronRight data-icon="inline-end" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
