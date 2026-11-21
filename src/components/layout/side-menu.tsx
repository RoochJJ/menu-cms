import { NavLink } from "react-router-dom";
import { cn } from "@/lib/merge-classes";
import { MENU_ITEMS } from "./menu-items";
import logo from "@/assets/logo.svg";

// Menu lateral com o logo e os links para cada área do CMS
export function SideMenu() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:flex md:h-svh md:flex-col">
      <div className="flex items-center gap-3 px-5 py-5 md:py-7">
        <img src={logo} alt="" className="size-9" />
        <div className="leading-tight">
          <p className="text-base font-bold text-white">Menu CMS</p>
          <p className="text-xs text-sidebar-foreground/70">Gestão do cardápio</p>
        </div>
      </div>

      <nav aria-label="Áreas do CMS" className="px-3 pb-3 md:flex-1 md:pb-6">
        <ul className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to} className="shrink-0">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-full before:bg-saffron"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <Icon className="size-4.5" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}