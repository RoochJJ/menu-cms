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
import type { SpotDTO, SpotInput } from "../dtos/spot.dto";
import { useCreateSpot, useUpdateSpot } from "../hooks/use-spots";

type SpotFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spot: SpotDTO | null; // null = cadastro; com valor = edição
};

// Janela com o formulário de cadastro/edição de mesa
export function SpotFormDialog({ open, onOpenChange, spot }: SpotFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* O formulário é montado a cada abertura, já com os dados da mesa */}
        <SpotForm spot={spot} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SpotForm({ spot, onDone }: { spot: SpotDTO | null; onDone: () => void }) {
  const isEditing = Boolean(spot);
  const [name, setName] = useState(spot?.name ?? "");
  const [active, setActive] = useState(spot?.active ?? true);
  const [nameError, setNameError] = useState<string>();

  const createMutation = useCreateSpot();
  const updateMutation = useUpdateSpot();
  const isPending = createMutation.isPending || updateMutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validação antes de enviar para a API
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Informe o nome da mesa.");
      return;
    }
    if (trimmed.length > 60) {
      setNameError("O nome pode ter no máximo 60 caracteres.");
      return;
    }

    const data: SpotInput = { name: trimmed, active };
    const callbacks = {
      onSuccess: () => {
        toast.success(isEditing ? "Mesa atualizada." : "Mesa cadastrada.");
        onDone();
      },
      onError: (error: unknown) => {
        toast.error(isEditing ? "Não foi possível salvar a mesa." : "Não foi possível cadastrar a mesa.", {
          description: getApiErrorMessage(error),
        });
      },
    };

    if (spot) {
      updateMutation.mutate({ id: spot.id, data }, callbacks);
    } else {
      createMutation.mutate(data, callbacks);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar mesa" : "Nova mesa"}</DialogTitle>
        <DialogDescription>Mesas inativas não recebem novos pedidos.</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <Field data-invalid={Boolean(nameError)}>
          <FieldLabel htmlFor="spot-name">Nome</FieldLabel>
          <Input
            id="spot-name"
            value={name}
            maxLength={60}
            autoFocus
            placeholder="Mesa 01"
            aria-invalid={Boolean(nameError)}
            onChange={(event) => {
              setName(event.target.value);
              setNameError(undefined);
            }}
          />
          <FieldDescription>Como a mesa aparece para a equipe e no cardápio.</FieldDescription>
          <FieldError>{nameError}</FieldError>
        </Field>

        <Field orientation="horizontal">
          <Switch id="spot-active" checked={active} onCheckedChange={setActive} />
          <FieldLabel htmlFor="spot-active">Mesa ativa</FieldLabel>
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner data-icon="inline-start" />}
          {isEditing ? "Salvar alterações" : "Cadastrar mesa"}
        </Button>
      </DialogFooter>
    </form>
  );
}
