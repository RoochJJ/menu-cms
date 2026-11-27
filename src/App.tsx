import { Route, Routes } from "react-router-dom";
import { PageLayout } from "./components/layout/page-layout";
import { NotFoundPage } from "./components/pages/not-found/not-found-page";
import { HomePage } from "./components/pages/home/home-page";
import { CategoriesPage } from "./components/pages/categories/categories-page";
import { ProductsPage } from "./components/pages/products/products-page";
import { SpotsPage } from "./components/pages/spots/spots-page";
import { GuestChecksPage } from "./components/pages/guest-checks/guest-checks-page";
import { GuestCheckDetailPage } from "./components/pages/guest-checks/guest-check-detail-page";
import { KanbanPage } from "./components/pages/kanban/kanban-page";

function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="spots" element={<SpotsPage />} />
        <Route path="guest-checks" element={<GuestChecksPage />} />
        <Route path="guest-checks/:id" element={<GuestCheckDetailPage />} />
        <Route path="kanban" element={<KanbanPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
