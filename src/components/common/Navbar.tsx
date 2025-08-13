import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Button from "./Button";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Navbar: React.FC = () => {
  const { role, user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicShopPage = pathname.startsWith("/shop/");
  const pathParts = pathname.split("/");
  const shopId =
    isPublicShopPage && pathParts.length >= 3 ? pathParts[2] : null;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <Link
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium md:text-sm md:inline-block md:mt-0"
    >
      {children}
    </Link>
  );

  const renderNavLinks = () => {
    if (role === "SUPERADMIN") {
      return (
        <>
          <NavLink to="/superadmin/dashboard">Dashboard</NavLink>
          <NavLink to="/superadmin/shops">Shops</NavLink>
        </>
      );
    }
    if (role === "SHOPADMIN") {
      return (
        <>
          <NavLink to="/shopadmin/dashboard">Dashboard</NavLink>
          <NavLink to="/shopadmin/orders">Orders</NavLink>
          <NavLink to="/shopadmin/payment">Payment</NavLink>
        </>
      );
    }
    if (isPublicShopPage && shopId) {
      return (
        <>
          <NavLink to={`/shop/${shopId}`}>Online Payment</NavLink>
          <NavLink to={`/shop/${shopId}/orders`}>Orders</NavLink>
        </>
      );
    }
    return null;
  };

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-lg font-bold">
              OrderManager
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {renderNavLinks()}
              {role && (
                <>
                  {user && (
                    <div className="flex items-center text-gray-300 mr-4">
                      <UserCircleIcon className="h-5 w-5 mr-1" />
                      <span>{user.name}</span>
                    </div>
                  )}
                  <Button onClick={handleLogout} variant="danger">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks()}
          </div>
          {role && (
            <div className="pt-4 pb-3 border-t border-gray-700">
              {user && (
                <div className="flex items-center px-5 py-3">
                  <div className="text-base font-medium leading-none text-white">
                    {user.name}
                  </div>
                  <div className="ml-3 text-sm font-medium leading-none text-gray-400">
                    {user.phone}
                  </div>
                </div>
              )}
              <div className="px-2">
                <Button
                  onClick={handleLogout}
                  variant="danger"
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
