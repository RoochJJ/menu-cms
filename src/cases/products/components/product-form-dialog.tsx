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
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api-error-message";
import type { CategoryDTO } from "@/cases/categories/dtos/category.dto";
import { CategorySelect } from "@/cases/categories/components/category-select";
import type { ProductDTO, ProductInput } from "../dtos/product.dto";
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import { ProductThumb } from "./product-thumb";

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDTO | null; // null = cadastro; com valor = edição
  categories: CategoryDTO[];
  defaultCategoryId: string | null;
};

// Janela com o formulário de cadastro/edição de produto
export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  defaultCategoryId,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-xl">
        {/* O formulário é montado a cada abertura, já com os dados do produto */}
        <ProductForm
          product={product}
          categories={categories}
          defaultCategoryId={defaultCategoryId}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

type FormValues = {
  name: string;
  description: string;
  price: string;
  picture: string;
  categoryId: string | null;
  vegetarian: boolean;
  isNew: boolean;
  active: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

// Aceita "29,90" ou "29.90"
function parsePrice(value: string) {
  return Number(value.trim().replace(",", "."));
}

// Validação antes de enviar para a API
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const price = values.price.trim();
  const picture = values.picture.trim();

  if (!name) {
    errors.name = "Informe o nome do produto.";
  } else if (name.length > 60) {
    errors.name = "O nome pode ter no máximo 60 caracteres.";
  }

  if (!price) {
    errors.price = "Informe o preço.";
  } else if (!/^\d+([.,]\d{1,2})?$/.test(price)) {
    errors.price = "Use um valor como 29,90.";
  } else if (parsePrice(price) <= 0) {
    errors.price = "O preço deve ser maior que zero.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Selecione a categoria.";
  }

  if (picture && !/^https?:\/\/\S+$/i.test(picture)) {
    errors.picture = "Informe uma URL válida, começando com http:// ou https://.";
  }

  return errors;
}

function ProductForm({
  product,
  categories,
  defaultCategoryId,
  onDone,
}: {
  product: ProductDTO | null;
  categories: CategoryDTO[];
  defaultCategoryId: string | null;
  onDone: () => void;
}) {
  const isEditing = Boolean(product);
  const [values, setValues] = useState<FormValues>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product ? product.price.toFixed(2).replace(".", ",") : "",
    picture: product?.picture ?? "",
    categoryId: product ? (product.category?.id ?? null) : defaultCategoryId,
    vegetarian: product?.vegetarian ?? false,
    isNew: product?.isNew ?? false,
    active: product?.active ?? true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Só categorias ativas podem ser escolhidas; a categoria atual do produto aparece mesmo se estiver inativa
  const options = categories.filter((category) => category.active || category.id === product?.category?.id);

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

    const data: ProductInput = {
      name: values.name.trim(),
      description: values.description.trim() || null,
      price: parsePrice(values.price),
      picture: values.picture.trim() || null,
      categoryId: values.categoryId,
      vegetarian: values.vegetarian,
      isNew: values.isNew,
      active: values.active,
    };

    const callbacks = {
      onSuccess: () => {
        toast.success(isEditing ? "Produto atualizado." : "Produto cadastrado.");
        onDone();
      },
      onError: (error: unknown) => {
        toast.error(isEditing ? "Não foi possível salvar o produto." : "Não foi possível cadastrar o produto.", {
          description: getApiErrorMessage(error),
        });
      },
    };

    if (product) {
      // A API só aceita categoria ativa: se a categoria não mudou, não reenviamos
      const { categoryId, ...rest } = data;
      const changes = categoryId === product.category?.id ? rest : data;
      updateMutation.mutate({ id: product.id, data: changes }, callbacks);
    } else {
      createMutation.mutate(data, callbacks);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar produto" : "Novo produto"}</DialogTitle>
        <DialogDescription>Os produtos ativos aparecem no cardápio dentro da categoria escolhida.</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Field data-invalid={Boolean(errors.name)}>
          <FieldLabel htmlFor="product-name">Nome</FieldLabel>
          <Input
            id="product-name"
            value={values.name}
            maxLength={60}
            autoFocus
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => setField("name", event.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="product-description">Descrição</FieldLabel>
          <Textarea
            id="product-description"
            rows={3}
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
          />
          <FieldDescription>Opcional. Ingredientes ou detalhes do preparo.</FieldDescription>
        </Field>

        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <Field data-invalid={Boolean(errors.price)}>
            <FieldLabel htmlFor="product-price">Preço (R$)</FieldLabel>
            <Input
              id="product-price"
              inputMode="decimal"
              placeholder="0,00"
              value={values.price}
              aria-invalid={Boolean(errors.price)}
              onChange={(event) => setField("price", event.target.value)}
            />
            <FieldError>{errors.price}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.categoryId)}>
            <FieldLabel htmlFor="product-category">Categoria</FieldLabel>
            <CategorySelect
              id="product-category"
              categories={options}
              value={values.categoryId}
              invalid={Boolean(errors.categoryId)}
              onValueChange={(value) => setField("categoryId", value)}
            />
            <FieldError>{errors.categoryId}</FieldError>
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.picture)}>
          <FieldLabel htmlFor="product-picture">Imagem (URL)</FieldLabel>
          <div className="flex items-center gap-3">
            <ProductThumb src={values.picture.trim() || null} className="size-10" />
            <Input
              id="product-picture"
              type="url"
              placeholder="https://..."
              value={values.picture}
              aria-invalid={Boolean(errors.picture)}
              onChange={(event) => setField("picture", event.target.value)}
            />
          </div>
          <FieldDescription>Opcional. Link público da foto do produto.</FieldDescription>
          <FieldError>{errors.picture}</FieldError>
        </Field>

        <div className="flex flex-col gap-4 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:gap-8">
          <Field orientation="horizontal" className="w-auto">
            <Switch
              id="product-vegetarian"
              checked={values.vegetarian}
              onCheckedChange={(checked) => setField("vegetarian", checked)}
            />
            <FieldLabel htmlFor="product-vegetarian">Vegetariano</FieldLabel>
          </Field>
          <Field orientation="horizontal" className="w-auto">
            <Switch id="product-new" checked={values.isNew} onCheckedChange={(checked) => setField("isNew", checked)} />
            <FieldLabel htmlFor="product-new">Novidade</FieldLabel>
          </Field>
          <Field orientation="horizontal" className="w-auto">
            <Switch
              id="product-active"
              checked={values.active}
              onCheckedChange={(checked) => setField("active", checked)}
            />
            <FieldLabel htmlFor="product-active">Ativo</FieldLabel>
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isEditing ? "Salvar alterações" : "Cadastrar produto"}
        </Button>
      </DialogFooter>
    </form>
  );
}
