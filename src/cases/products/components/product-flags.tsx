import { Leaf, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Indicadores de vegetariano e novidade
export function ProductFlags({ vegetarian, isNew }: { vegetarian: boolean; isNew: boolean }) {
  if (!vegetarian && !isNew) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {vegetarian && (
        <Badge variant="outline" className="border-status-ready/30 bg-status-ready/10 text-status-ready">
          <Leaf data-icon="inline-start" />
          Vegetariano
        </Badge>
      )}
      {isNew && (
        <Badge variant="outline" className="border-saffron/50 bg-accent text-accent-foreground">
          <Sparkles data-icon="inline-start" />
          Novidade
        </Badge>
      )}
    </div>
  );
}
