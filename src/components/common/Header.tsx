import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import routes from "../../routes";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = routes.filter((route) => route.visible !== false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="navbar-glass sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-glow to-secondary flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline-block">
              {t("common.appName")}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Button
                key={item.path}
                asChild
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={
                  location.pathname === item.path
                    ? "btn-gradient text-white shadow-medium"
                    : "hover:bg-accent/50"
                }
              >
                <Link to={item.path} className="font-medium">
                  {t(`nav.${item.name.toLowerCase()}`)}
                </Link>
              </Button>
            ))}
            <div className="ml-2 flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-2"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      Hello {user.user_metadata?.full_name || "User"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-sm text-muted-foreground">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="default" className="btn-gradient ml-2">
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 fade-in">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow-medium"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`nav.${item.name.toLowerCase()}`)}
              </Link>
            ))}
            <div className="px-4 py-2 flex gap-2 flex-col">
              {user && (
                <div className="text-sm font-medium text-muted-foreground px-2 py-1">
                  Hello {user.user_metadata?.full_name || "User"}
                </div>
              )}
              <div className="flex gap-2">
                <LanguageSwitcher />
                <ThemeSwitcher />
                {user ? (
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="default"
                    className="btn-gradient flex-1"
                  >
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
