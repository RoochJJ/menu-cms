import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { getApiErrorMessage } from "@/lib/api-error-message";
import type { CategoryDTO, CategoryInput } from "../dtos/category.dto";
import { useCreateCategory, useUpdateCategory } from "../hooks/use-category";
import { CategoryIcon } from "./category-icon";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryDTO | null; // null = cadastro; com valor = edição
  nextOrder: number;
};

// Janela com o formulário de cadastro/edição de categoria
export function CategoryFormDialog({ open, onOpenChange, category, nextOrder }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* O formulário é montado a cada abertura, já com os dados da categoria */}
        <CategoryForm category={category} nextOrder={nextOrder} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

type FormValues = {
  name: string;
  icon: string;
  displayOrder: string;
  active: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

// Validação antes de enviar para a API
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const icon = values.icon.trim();

  if (!name) {
    errors.name = "Informe o nome da categoria.";
  } else if (name.length > 60) {
    errors.name = "O nome pode ter no máximo 60 caracteres.";
  }

  if (icon && !/^https?:\/\/\S+$/i.test(icon)) {
    errors.icon = "Informe uma URL válida, começando com http:// ou https://.";
  }

  if (values.displayOrder.trim() === "") {
    errors.displayOrder = "Informe a ordem de exibição.";
  } else if (!/^\d+$/.test(values.displayOrder.trim())) {
    errors.displayOrder = "Use um número inteiro igual ou maior que zero.";
  }

  return errors;
}

function CategoryForm({
  category,
  nextOrder,
  onDone,
}: {
  category: CategoryDTO | null;
  nextOrder: number;
  onDone: () => void;
}) {
  const isEditing = Boolean(category);
  const [values, setValues] = useState<FormValues>({
    name: category?.name ?? "",
    icon: category?.icon ?? "",
    displayOrder: String(category?.displayOrder ?? nextOrder),
    active: category?.active ?? true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Atualiza um campo e apaga o erro dele
  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data: CategoryInput = {
      name: values.name.trim(),
      icon: values.icon.trim() || null,
      displayOrder: Number(values.displayOrder),
      active: values.active,
    };

    const callbacks = {
      onSuccess: () => {
        toast.success(isEditing ? "Categoria atualizada." : "Categoria cadastrada.");
        onDone();
      },
      onError: (error: unknown) => {
        toast.error(isEditing ? "Não foi possível salvar a categoria." : "Não foi possível cadastrar a categoria.", {
          description: getApiErrorMessage(error),
        });
      },
    };

    if (category) {
      updateMutation.mutate({ id: category.id, data }, callbacks);
    } else {
      createMutation.mutate(data, callbacks);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        <DialogDescription>
          As categorias organizam o cardápio. A ordem define a posição de cada uma no menu.
        </DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="category-name">Nome</FieldLabel>
          <Input
            id="category-name"
            value={values.name}
            maxLength={60}
            autoFocus
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => setField("name", event.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.icon)}>
          <FieldLabel htmlFor="category-icon">Ícone (URL)</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
              <CategoryIcon src={values.icon.trim() || null} className="size-7" />
            </div>
            <Input
              id="category-icon"
              type="url"
              placeholder="https://..."
              value={values.icon}
              aria-invalid={Boolean(errors.icon)}
              onChange={(event) => setField("icon", event.target.value)}
            />
          </div>
          <FieldDescription>Opcional. Link público do ícone (ex.: Storage do Supabase).</FieldDescription>
          <FieldError>{errors.icon}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.displayOrder)} className="sm:max-w-56">
          <FieldLabel htmlFor="category-order">Ordem de exibição</FieldLabel>
          <Input
            id="category-order"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={values.displayOrder}
            aria-invalid={Boolean(errors.displayOrder)}
            onChange={(event) => setField("displayOrder", event.target.value)}
          />
          <FieldError>{errors.displayOrder}</FieldError>
        </Field>

        <Field orientation="horizontal">
          <Switch
            id="category-active"
            checked={values.active}
            onCheckedChange={(checked) => setField("active", checked)}
          />
          <FieldLabel htmlFor="category-active">Categoria ativa</FieldLabel>
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isEditing ? "Salvar alterações" : "Cadastrar categoria"}
        </Button>
      </DialogFooter>
    </form>
  );
}