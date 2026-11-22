import { Armchair, House, ReceiptText, Tags, UtensilsCrossed, type LucideIcon } from "lucide-react";

export type MenuItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

// Áreas do CMS que aparecem no menu lateral
export const MENU_ITEMS: MenuItem[] = [
  { to: "/", label: "Início", icon: House },
  { to: "/categories", label: "Categorias", icon: Tags },
  { to: "/products", label: "Produtos", icon: UtensilsCrossed },
  { to: "/spots", label: "Mesas", icon: Armchair },
  { to: "/guest-checks", label: "Comandas", icon: ReceiptText },
];
