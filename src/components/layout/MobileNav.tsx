
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
  handleSignOut: () => Promise<void>;
}

const MobileNav = ({ isOpen, toggleMenu, handleSignOut }: MobileNavProps) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 mt-2 glass-card max-w-4xl mx-auto px-4">
      <Link
        to="/"
        className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
        onClick={toggleMenu}
      >
        Accueil
      </Link>
      <Link
        to="/products"
        className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
        onClick={toggleMenu}
      >
        Shop
      </Link>
      <Link
        to="/lotteries"
        className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
        onClick={toggleMenu}
      >
        Loteries
      </Link>
      {user && (
        <>
          <Link
            to="/admin"
            className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
            onClick={toggleMenu}
          >
            Admin
          </Link>
          <Link
            to="/admin/mockups"
            className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
            onClick={toggleMenu}
          >
            Gestion des mockups
          </Link>
          <Link
            to="/admin/theme"
            className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
            onClick={toggleMenu}
          >
            Réglages du thème
          </Link>
        </>
      )}
      {user ? (
        <div 
          onClick={() => {
            handleSignOut();
            toggleMenu();
          }}
          className="block text-white/70 hover:text-white px-3 py-2 rounded-md cursor-pointer"
        >
          <span className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </span>
        </div>
      ) : (
        <Link
          to="/auth"
          className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
          onClick={toggleMenu}
        >
          <span className="flex items-center">
            <LogIn className="h-4 w-4 mr-2" />
            Connexion
          </span>
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
