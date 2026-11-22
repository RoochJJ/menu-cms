import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/merge-classes";
import type { CategoryDTO } from "../dtos/category.dto";

type CategorySelectProps = {
  id?: string;
  categories: CategoryDTO[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  // Texto da opção "sem filtro" (ex.: "Todas as categorias"). Se não informar, a opção não aparece.
  allLabel?: string;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
};

// Select de categorias alimentado pela API (usado no filtro e no formulário de produto)
export function CategorySelect({
  id,
  categories,
  value,
  onValueChange,
  allLabel,
  placeholder = "Selecione a categoria",
  invalid = false,
  className,
}: CategorySelectProps) {
  const items = [
    ...(allLabel ? [{ value: null, label: allLabel }] : []),
    ...categories.map((category) => ({
      value: category.id,
      label: category.active ? category.name : `${category.name} (inativa)`,
    })),
  ];

  return (
    <Select items={items} value={value} onValueChange={(next) => onValueChange(next)}>
      <SelectTrigger id={id} aria-invalid={invalid} className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value ?? "all"} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
