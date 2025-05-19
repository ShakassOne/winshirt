
import React from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface UserProfileDropdownProps {
  handleSignOut: () => Promise<void>;
}

const UserProfileDropdown = ({ handleSignOut }: UserProfileDropdownProps) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Button variant="ghost" size="icon" className="text-white/80 hover:text-white" asChild>
        <Link to="/auth">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="hover:bg-white/5">
          <Link to="/account" className="flex w-full">Profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-white/5">
          <Link to="/orders" className="flex w-full">Mes commandes</Link>
        </DropdownMenuItem>
        {user && (
          <>
            <DropdownMenuItem className="hover:bg-white/5">
              <Link to="/admin" className="flex w-full">Administration</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5">
              <Link to="/admin/mockups" className="flex w-full">Mockups Admin</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="hover:bg-white/5" 
          onClick={handleSignOut}
        >
          <span className="flex items-center w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
