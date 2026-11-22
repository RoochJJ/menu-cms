import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActiveBadge } from "@/components/shared/active-badge";
import type { CategoryDTO } from "../dtos/category.dto";
import { CategoryIcon } from "./category-icon";

type CategoryTableProps = {
  categories: CategoryDTO[];
  onEdit: (category: CategoryDTO) => void;
  onDelete: (category: CategoryDTO) => void;
};

// Tabela com ícone, nome, ordem, situação e botões de editar/excluir
export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 pl-4">Ícone</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="w-24 text-right">Ordem</TableHead>
            <TableHead className="w-32">Situação</TableHead>
            <TableHead className="w-28 pr-4 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="pl-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <CategoryIcon src={category.icon} className="size-7" />
                </div>
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-right tabular-nums">{category.displayOrder}</TableCell>
              <TableCell>
                <ActiveBadge active={category.active} feminine />
              </TableCell>
              <TableCell className="pr-4">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar ${category.name}`}
                    onClick={() => onEdit(category)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Excluir ${category.name}`}
                    onClick={() => onDelete(category)}
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
