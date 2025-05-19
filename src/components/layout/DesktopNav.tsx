
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const DesktopNav = () => {
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex space-x-4">
      <Link
        to="/"
        className="text-white/80 hover:text-white transition-colors px-3 py-1"
      >
        Accueil
      </Link>
      <Link
        to="/products"
        className="text-white/80 hover:text-white transition-colors px-3 py-1"
      >
        Shop
      </Link>
      <Link
        to="/lotteries"
        className="text-white/80 hover:text-white transition-colors px-3 py-1"
      >
        Loteries
      </Link>
      {user && (
        <Link
          to="/admin"
          className="text-white/80 hover:text-white transition-colors px-3 py-1"
        >
          Admin
        </Link>
      )}
    </nav>
  );
};

export default DesktopNav;
