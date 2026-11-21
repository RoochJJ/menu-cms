import type { ReactNode } from "react";

type PageTitleProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

// Título, descrição e botões do topo de cada tela
export function PageTitle({ title, description, actions }: PageTitleProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}