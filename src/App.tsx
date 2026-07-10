import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AdminLayout } from "./components/admin-layout"
import { AuthProvider } from "./hooks/use-auth"
import { ProtectedRoute } from "./components/protected-route"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Products from "./pages/Products"
import AddProduct from "./pages/AddProduct"
import Orders from "./pages/Orders"

import Coupons from "./pages/Coupons"
import Referrals from "./pages/Referrals"
import Wallet from "./pages/Wallet"
import Refunds from "./pages/Refunds"
import Notifications from "./pages/Notifications"
import Languages from "./pages/Languages"
import Permissions from "./pages/Permissions"
import Reports from "./pages/Reports"
import Shipping from "./pages/Shipping"
import SettingsPage from "./pages/Settings"
import Banners from "./pages/Banners"
import HomeOffers from "./pages/HomeOffers"
import Brands from "./pages/Brands"
import Categories from "./pages/Categories"
import GalleryPage from "./pages/GalleryPage"
import SubAdmins from "./pages/SubAdmins"
import UserDetails from "./pages/UserDetails"
import ProductDetails from "./pages/ProductDetails"
import OrderDetails from "./pages/OrderDetails"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/products/edit/:id" element={<AddProduct />} />
                <Route path="/products/view/:id" element={<ProductDetails />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/packages" element={<Navigate to="/products" replace />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/team" element={<SubAdmins />} />
                <Route path="/banners" element={<Banners />} />
                <Route path="/home-offers" element={<HomeOffers />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/refunds" element={<Refunds />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/languages" element={<Languages />} />
                <Route path="/permissions" element={<Permissions />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  )
}

export default App
