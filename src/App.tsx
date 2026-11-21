import { Navigate, Route, Routes } from "react-router-dom";
import { PageLayout } from "./components/layout/page-layout";
import { NotFoundPage } from "./components/pages/not-found/not-found-page";

function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route index element={<Navigate to="/categories" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;