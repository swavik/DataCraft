import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Home, Info, Zap, Database, HelpCircle, LogIn, LayoutDashboard, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import UserProfileSheet from "@/components/UserProfileSheet";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Header() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const { profile, updateProfile } = useUserProfile();
  const [showProfileSheet, setShowProfileSheet] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            DataCraft
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" activeClassName="text-primary font-semibold" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Home
          </NavLink>
          <a href="#features" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Zap className="w-4 h-4" />
            Features
          </a>
          <a href="#models" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <Database className="w-4 h-4" />
            Models
          </a>
          <a href="#how-it-works" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
            <HelpCircle className="w-4 h-4" />
            How It Works
          </a>
          <NavLink to="/about" activeClassName="text-primary font-semibold" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Info className="w-4 h-4" />
            About Us
          </NavLink>
          <NavLink to="/contact" activeClassName="text-primary font-semibold" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4" />
            Contact
          </NavLink>
        </nav>

        {/* Auth & Actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm font-semibold">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfileSheet(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/home')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <UserProfileSheet 
                open={showProfileSheet} 
                onOpenChange={setShowProfileSheet}
                profile={profile}
                updateProfile={updateProfile}
              />
            </>
          ) : (
            <>
              <NavLink to="/auth">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </NavLink>
              <NavLink to="/auth">
                <Button size="sm">Get Started</Button>
              </NavLink>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
