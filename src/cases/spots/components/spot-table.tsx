import { Armchair, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActiveBadge } from "@/components/shared/active-badge";
import type { SpotDTO } from "../dtos/spot.dto";

type SpotTableProps = {
  spots: SpotDTO[];
  onEdit: (spot: SpotDTO) => void;
  onDelete: (spot: SpotDTO) => void;
};

// Tabela com o nome da mesa, a situação e os botões de editar/excluir
export function SpotTable({ spots, onEdit, onDelete }: SpotTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Mesa</TableHead>
            <TableHead className="w-32">Situação</TableHead>
            <TableHead className="w-28 pr-4 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spots.map((spot) => (
            <TableRow key={spot.id}>
              <TableCell className="pl-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Armchair className="size-4" aria-hidden="true" />
                  </div>
                  <span className="font-medium">{spot.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <ActiveBadge active={spot.active} feminine />
              </TableCell>
              <TableCell className="pr-4">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" aria-label={`Editar ${spot.name}`} onClick={() => onEdit(spot)}>
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Excluir ${spot.name}`}
                    onClick={() => onDelete(spot)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
