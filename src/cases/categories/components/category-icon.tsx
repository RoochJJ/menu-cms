import { useState } from "react";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/merge-classes";

type CategoryIconProps = {
  src: string | null;
  className?: string;
};

// Mostra o ícone da categoria; se não houver ou falhar ao carregar, usa um ícone padrão
export function CategoryIcon({ src, className }: CategoryIconProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const url = src?.replace(/\.svgr$/, ".svg") ?? null;

  if (!url || failedSrc === url) {
    return <Utensils aria-hidden="true" className={cn("size-6 text-muted-foreground", className)} />;
  }

  return <img src={url} alt="" className={cn("size-8 object-contain", className)} onError={() => setFailedSrc(url)} />;
}