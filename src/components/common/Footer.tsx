import React from "react";
import { useLocation, useParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Footer: React.FC = () => {
  const { role } = useAuthStore();
  const location = useLocation();
  const params = useParams<{ shopId?: string }>();
  const { shopId } = params;

  const isPublicShopPage = location.pathname.startsWith("/shop/");

  // A simple way to get a shop name from the slug for display
  const shopDisplayName = shopId
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <footer className="bg-gray-800 text-white mt-auto py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {isPublicShopPage && !role ? (
          <p>
            &copy; {new Date().getFullYear()} {shopDisplayName || "Shop"}. All
            rights reserved.
          </p>
        ) : (
          <p>
            &copy; {new Date().getFullYear()} OrderManager. All rights reserved.
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
