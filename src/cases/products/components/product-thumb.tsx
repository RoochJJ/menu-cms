import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/merge-classes";

type ProductThumbProps = {
  src: string | null;
  className?: string;
};

// Miniatura do produto; sem imagem (ou com falha ao carregar) mostra um ícone neutro
export function ProductThumb({ src, className }: ProductThumbProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted",
        className
      )}
    >
      {showImage ? (
        <img src={src!} alt="" className="size-full object-cover" onError={() => setFailedSrc(src)} />
      ) : (
        <ImageOff aria-hidden="true" className="size-5 text-muted-foreground" />
      )}
    </div>
  );
}
