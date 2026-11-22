import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActiveBadge } from "@/components/shared/active-badge";
import { formatPrice } from "@/lib/format-values";
import type { ProductDTO } from "../dtos/product.dto";
import { ProductThumb } from "./product-thumb";
import { ProductFlags } from "./product-flags";

type ProductTableProps = {
  products: ProductDTO[];
  onEdit: (product: ProductDTO) => void;
  onDelete: (product: ProductDTO) => void;
};

// Tabela com imagem, nome, categoria, preço, indicadores, situação e ações
export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 pl-4">Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead>Indicadores</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead className="w-28 pr-4 text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="pl-4">
                <ProductThumb src={product.picture} />
              </TableCell>
              <TableCell className="max-w-72 whitespace-normal">
                <p className="font-medium">{product.name}</p>
                {product.description && (
                  <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                )}
              </TableCell>
              <TableCell>
                {product.category ? (
                  product.category.name
                ) : (
                  <span className="text-muted-foreground">Sem categoria</span>
                )}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">{formatPrice(product.price)}</TableCell>
              <TableCell>
                <ProductFlags vegetarian={product.vegetarian} isNew={product.isNew} />
              </TableCell>
              <TableCell>
                <ActiveBadge active={product.active} />
              </TableCell>
              <TableCell className="pr-4">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editar ${product.name}`}
                    onClick={() => onEdit(product)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Excluir ${product.name}`}
                    onClick={() => onDelete(product)}
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
