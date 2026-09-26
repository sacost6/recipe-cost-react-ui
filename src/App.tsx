import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import IngredientsPage from './features/ingredients/pages/IngredientsPage';
import IngredientDetailsPage from './features/ingredients/pages/IngredientDetailsPage';
import LoginPage from './features/users/pages/LoginPage';
import RequireAuth from './features/users/components/RequireAuth';
import RegisterPage from './features/users/pages/RegistrationPage';
import { IngredientsProvider } from './features/ingredients/IngredientProvider';
import { ProductProvider } from './features/products/ProductProvider';
import Container from './components/Container';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      <Header />
      {/* Dynamic Page Routes */}
      <Container className="flex flex-1 flex-col">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/ingredients"
            element={
              <RequireAuth>
                <IngredientsProvider>
                  <ProductProvider>
                    <Outlet />
                  </ProductProvider>
                </IngredientsProvider>
              </RequireAuth>
            }
          >
            <Route index element={<IngredientsPage />} />
            <Route path=":ingredientId" element={<IngredientDetailsPage />} />
          </Route>
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}
