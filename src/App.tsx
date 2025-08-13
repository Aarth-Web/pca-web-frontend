import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
// Import auth utilities for handling unauthorized errors
import "./utils/authUtils";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";

// Auth Pages
import Login from "./pages/auth/Login";

// Superadmin Pages
import SuperadminDashboard from "./pages/superadmin/Dashboard";
import ShopsList from "./pages/superadmin/ShopsList";
import CreateShop from "./pages/superadmin/CreateShop";
import EditShop from "./pages/superadmin/EditShop";

// Shop Admin Pages
import ShopAdminDashboard from "./pages/shopadmin/Dashboard";
import OrdersList from "./pages/shopadmin/OrdersList";
import CreateOrder from "./pages/shopadmin/CreateOrder";
import EditOrder from "./pages/shopadmin/EditOrder";
import PaymentDetails from "./pages/shopadmin/PaymentDetails";

// Public Pages
import ShopView from "./pages/public/ShopView";
import PublicOrdersPage from "./pages/public/PublicOrdersPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto p-1 md:p-4">
            <Routes>
              {/* Auth Route - Unified Login */}
              <Route path="/login" element={<Login />} />

              {/* Superadmin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["SUPERADMIN"]} />}>
                <Route
                  path="/superadmin/dashboard"
                  element={<SuperadminDashboard />}
                />
                <Route path="/superadmin/shops" element={<ShopsList />} />
                <Route
                  path="/superadmin/shops/create"
                  element={<CreateShop />}
                />
                <Route
                  path="/superadmin/shops/edit/:id"
                  element={<EditShop />}
                />
              </Route>

              {/* Shop Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={["SHOPADMIN"]} />}>
                <Route
                  path="/shopadmin/dashboard"
                  element={<ShopAdminDashboard />}
                />
                <Route path="/shopadmin/orders" element={<OrdersList />} />
                <Route
                  path="/shopadmin/orders/create"
                  element={<CreateOrder />}
                />
                <Route
                  path="/shopadmin/orders/edit/:id"
                  element={<EditOrder />}
                />
                <Route path="/shopadmin/payment" element={<PaymentDetails />} />
              </Route>

              {/* Public Routes */}
              <Route path="/shop/:shopId" element={<ShopView />} />
              <Route
                path="/shop/:shopId/orders"
                element={<PublicOrdersPage />}
              />

              {/* Redirect root to the unified login page */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
