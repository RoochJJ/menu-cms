import { Navigate, Route, Routes } from "react-router-dom";
import { PageLayout } from "./components/layout/page-layout";
import { NotFoundPage } from "./components/pages/not-found/not-found-page";
import { CategoriesPage } from "./components/pages/categories/categories-page";
import { ProductsPage } from "./components/pages/products/products-page";
import { SpotsPage } from "./components/pages/spots/spots-page";

function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<Navigate to="/categories" replace />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="spots" element={<SpotsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
