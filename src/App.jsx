// Rutas. Las URL siguen los nombres de archivo del template (p. ej. /carrito, /comprar, /admin/producto).
import { Route, Routes } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import RequireAdmin from './components/layout/RequireAdmin.jsx';

import HomePage from './pages/public/HomePage.jsx';
import CatalogPage from './pages/public/CatalogPage.jsx';
import ProductDetailPage from './pages/public/ProductDetailPage.jsx';
import CategoriesPage from './pages/public/CategoriesPage.jsx';
import OffersPage from './pages/public/OffersPage.jsx';
import CartPage from './pages/public/CartPage.jsx';
import CheckoutPage from './pages/public/CheckoutPage.jsx';
import PaymentSuccessPage from './pages/public/PaymentSuccessPage.jsx';
import PaymentFailedPage from './pages/public/PaymentFailedPage.jsx';
import WishlistPage from './pages/public/WishlistPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';
import RecoverPasswordPage from './pages/public/RecoverPasswordPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import BlogPage from './pages/public/BlogPage.jsx';
import BlogPostPage from './pages/public/BlogPostPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import MyAccountPage from './pages/public/MyAccountPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';

import DashboardPage from './pages/admin/DashboardPage.jsx';
import { OrdersPage, OrderDetailPage } from './pages/admin/OrderPages.jsx';
import {
  ProductsPage,
  ProductCreatePage,
  ProductShowPage,
  ProductEditPage,
  CriticalProductsPage,
  ProductCardsPage,
  ProductReportsPage,
} from './pages/admin/ProductPages.jsx';
import { CategoriesAdminPage, CategoryCreatePage, CategoryEditPage } from './pages/admin/CategoryPages.jsx';
import {
  UsersPage,
  CharactersPage,
  UserCreatePage,
  UserShowPage,
  UserEditPage,
  PurchaseHistoryPage,
  UserOrderDetailPage,
} from './pages/admin/UserPages.jsx';
import GeneralReportsPage from './pages/admin/GeneralReportsPage.jsx';
import ProfilePage from './pages/admin/ProfilePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<CatalogPage />} />
        <Route path="productos/:id" element={<ProductDetailPage />} />
        <Route path="categorias" element={<CategoriesPage />} />
        <Route path="categorias/:slug" element={<CategoriesPage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="favoritos" element={<WishlistPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="comprar" element={<CheckoutPage />} />
        <Route path="comprar-ok/:orderId" element={<PaymentSuccessPage />} />
        <Route path="comprar-error" element={<PaymentFailedPage />} />
        <Route path="iniciar-sesion" element={<LoginPage />} />
        <Route path="crear-sesion" element={<RegisterPage />} />
        <Route path="recuperar-contrasena" element={<RecoverPasswordPage />} />
        <Route path="nosotros" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="mi-cuenta" element={<MyAccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        path="admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="ordenes" element={<OrdersPage />} />
        <Route path="ordenes/:orderId" element={<OrderDetailPage />} />
        <Route path="producto" element={<ProductsPage />} />
        <Route path="producto/nuevo" element={<ProductCreatePage />} />
        <Route path="producto/criticos" element={<CriticalProductsPage />} />
        <Route path="producto/formato" element={<ProductCardsPage />} />
        <Route path="producto/reporte" element={<ProductReportsPage />} />
        <Route path="producto/:id" element={<ProductShowPage />} />
        <Route path="producto/:id/editar" element={<ProductEditPage />} />
        <Route path="categoria" element={<CategoriesAdminPage />} />
        <Route path="categoria/nuevo" element={<CategoryCreatePage />} />
        <Route path="categoria/:id/editar" element={<CategoryEditPage />} />
        <Route path="usuario" element={<UsersPage />} />
        <Route path="usuario/personajes" element={<CharactersPage />} />
        <Route path="usuario/nuevo" element={<UserCreatePage />} />
        <Route path="usuario/:id" element={<UserShowPage />} />
        <Route path="usuario/:id/editar" element={<UserEditPage />} />
        <Route path="usuario/:id/historial" element={<PurchaseHistoryPage />} />
        <Route path="usuario/:id/historial/:orderId" element={<UserOrderDetailPage />} />
        <Route path="reporte" element={<GeneralReportsPage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
