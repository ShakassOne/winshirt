
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import CartIcon from "@/components/cart/CartIcon";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnecté avec succès",
        description: "À bientôt sur WinShirt!",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la déconnexion.",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 pt-4">
        <div className="max-w-4xl mx-auto rounded-full bg-black/60 backdrop-blur-lg border border-white/10 shadow-lg">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gradient">WinShirt</span>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav />

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <ThemeToggle />
              <CartIcon />
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* User Menu, Theme Toggle and Cart */}
            <div className="hidden md:flex items-center space-x-1">
              <ThemeToggle />
              <UserProfileDropdown handleSignOut={handleSignOut} />
              <CartIcon />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav 
          isOpen={isOpen} 
          toggleMenu={toggleMenu} 
          handleSignOut={handleSignOut}
        />
      </div>
    </header>
  );
};

export default Navbar;
