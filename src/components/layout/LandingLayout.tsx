import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import authBg from '@/assets/auth-background.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { UserNav } from '@/components/layout/UserNav';
import { cn } from '@/lib/utils';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout = ({ children }: LandingLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Generate', href: '/home' },
    { name: 'Features', href: '/features' },
    { name: 'Models', href: '/models' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative font-sans scroll-smooth bg-background">
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 lg:px-20 sticky top-0 bg-background/50 backdrop-blur-md z-50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">DataCraft</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  location.pathname === link.href
                    ? "text-[#E87B64]" 
                    : "text-foreground/70 hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <UserNav />
            ) : (
              <>
                <button 
                  onClick={() => navigate('/auth')}
                  className="text-foreground font-medium hover:text-primary px-4 text-sm"
                >
                  Login
                </button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl px-6"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>

        <main className="flex-1 overflow-hidden grid-pattern">
          {children}
        </main>
      </div>
    </div>
  );
};
