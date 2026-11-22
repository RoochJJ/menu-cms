import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Armchair,
  ChevronRight,
  CupSoda,
  Hamburger,
  IceCreamCone,
  ReceiptText,
  Salad,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, LoadingState } from "@/components/shared/screen-states";
import { cn } from "@/lib/merge-classes";
import { formatPrice, formatTime } from "@/lib/format-values";
import { useCategories } from "@/cases/categories/hooks/use-category";
import { useProducts } from "@/cases/products/hooks/use-products";
import { useSpots } from "@/cases/spots/hooks/use-spots";
import { useOpenGuestChecks } from "@/cases/guest-checks/hooks/use-guest-checks";

// Página inicial: apresentação do restaurante e resumo do que está na API
export function HomePage() {
  const categories = useCategories();
  const products = useProducts();
  const spots = useSpots();
  const guestChecks = useOpenGuestChecks();

  // Atalhos para cada área, com a quantidade de registros vinda da API
  const shortcuts = [
    { to: "/categories", label: "Categorias", icon: Tags, query: categories, color: "bg-secondary text-secondary-foreground" },
    { to: "/products", label: "Produtos", icon: Hamburger, query: products, color: "bg-accent text-accent-foreground" },
    { to: "/spots", label: "Mesas", icon: Armchair, query: spots, color: "bg-primary/10 text-primary" },
    { to: "/guest-checks", label: "Comandas abertas", icon: ReceiptText, query: guestChecks, color: "bg-sidebar text-sidebar-foreground" },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Destaque com o nome do restaurante e "pratos" decorativos em volta */}
      <section className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center md:py-24">
        <DecorativePlate icon={Hamburger} className="-left-8 -top-8 size-40 bg-secondary text-secondary-foreground" />
        <DecorativePlate icon={CupSoda} className="-right-6 top-6 size-28 bg-accent text-accent-foreground" />
        <DecorativePlate icon={Salad} className="-bottom-10 left-14 size-32 bg-primary/10 text-primary" />
        <DecorativePlate icon={IceCreamCone} className="-bottom-8 -right-8 size-40 bg-secondary text-secondary-foreground" />

        <h1 className="mt-5 text-5xl leading-[1.05] font-extralight tracking-[0.2em] text-sidebar uppercase sm:text-7xl md:text-8xl">
          Vertus
          <br />
          Burger
        </h1>
        <p className="mt-6 text-lg font-light text-muted-foreground">hambúrgueres artesanais</p>
        <Link to="/guest-checks" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          Ver comandas abertas
        </Link>
      </section>

      {/* Atalhos com a contagem de cada área */}
      <section aria-label="Áreas do CMS" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {shortcuts.map(({ to, label, icon: Icon, query, color }) => (
          <Link
            key={to}
            to={to}
            className="group overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
          >
            <div className={cn("flex h-24 items-center justify-center", color)}>
              <Icon className="size-10 transition-transform group-hover:scale-110" aria-hidden="true" />
            </div>
            <div className="flex items-end justify-between p-4">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                {query.isLoading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : query.isError ? (
                  <p className="mt-1 text-sm text-destructive">Erro ao carregar</p>
                ) : (
                  <p className="text-3xl font-semibold tabular-nums">{query.data?.length ?? 0}</p>
                )}
              </div>
              <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </section>

      {/* Dois blocos lado a lado: comandas abertas e resumo do cardápio */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6">
          <SectionHeading title="Comandas" subtitle="em aberto agora" />
          {guestChecks.isLoading && <LoadingState rows={3} label="Carregando comandas" />}
          {guestChecks.isError && <ErrorState error={guestChecks.error} onRetry={() => guestChecks.refetch()} />}
          {guestChecks.data && guestChecks.data.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma comanda aberta no momento.</p>
          )}
          {guestChecks.data && guestChecks.data.length > 0 && (
            <ul className="divide-y">
              {guestChecks.data.slice(0, 5).map((guestCheck) => (
                <li key={guestCheck.id}>
                  <Link
                    to={`/guest-checks/${guestCheck.id}`}
                    className="flex items-center justify-between gap-4 py-3 hover:text-primary"
                  >
                    <span className="font-medium">{guestCheck.spot.name}</span>
                    <span className="text-sm text-muted-foreground">desde {formatTime(guestCheck.createdAt)}</span>
                    <span className="ml-auto font-semibold tabular-nums">{formatPrice(guestCheck.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <SectionHeading title="Cardápio" subtitle="resumo dos produtos" />
          {products.isLoading && <LoadingState rows={3} label="Carregando produtos" />}
          {products.isError && <ErrorState error={products.error} onRetry={() => products.refetch()} />}
          {products.data && (
            <dl className="grid grid-cols-2 gap-4">
              <SummaryItem label="Produtos ativos" value={products.data.filter((product) => product.active).length} />
              <SummaryItem label="Inativos" value={products.data.filter((product) => !product.active).length} />
              <SummaryItem label="Novidades" value={products.data.filter((product) => product.isNew).length} />
              <SummaryItem label="Vegetarianos" value={products.data.filter((product) => product.vegetarian).length} />
            </dl>
          )}
        </section>
      </div>
    </div>
  );
}

// Círculo decorativo com um ícone de comida, como os pratos em volta do nome
function DecorativePlate({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute hidden items-center justify-center rounded-full shadow-sm md:flex", className)}
    >
      <Icon className="size-1/2" strokeWidth={1.25} />
    </div>
  );
}

// Título de seção no estilo da referência: grande e fino, com subtítulo e linha
function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-4 border-b pb-3 text-center">
      <h2 className="text-3xl font-extralight tracking-[0.15em] uppercase">{title}</h2>
      <p className="text-sm font-light text-muted-foreground">{subtitle}</p>
    </header>
  );
}

function SummaryItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/60 p-4 text-center">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
