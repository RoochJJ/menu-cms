import { Outlet } from "react-router-dom";
import { SideMenu } from "./side-menu";

// Estrutura de todas as telas: menu lateral à esquerda e conteúdo à direita
export function PageLayout() {
  return (
    <div className="min-h-svh md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <SideMenu />

      <main className="px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}