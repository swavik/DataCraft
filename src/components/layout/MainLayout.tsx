import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, ArrowLeft, Sparkles, User, History } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { UserNav } from './UserNav';
import { DatasetHistory } from '@/types/dataset';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: ReactNode;
  history: DatasetHistory[];
  onSelectDataset: (id: string) => void;
  onDeleteDataset: (id: string) => void;
  currentDatasetId?: string;
}

const MainLayout = ({ 
  children, 
  history, 
  onSelectDataset, 
  onDeleteDataset,
  currentDatasetId 
}: MainLayoutProps) => {
  const location = useLocation();


  const generatePath = "/home";
  const isGenerateActive = ['/upload', '/preview', '/synthetic'].includes(location.pathname);

  const navLinks = [
    { name: 'Back', href: '/', icon: ArrowLeft },
    { name: 'Generate', href: '/home', icon: Database, active: isGenerateActive },
    { name: 'Gen AI', href: '/gen-ai', icon: Sparkles, active: location.pathname === '/gen-ai' },
    { name: 'History', href: '/history', icon: History, active: location.pathname === '/history' },
    { name: 'Account', href: '/profile', icon: User, active: location.pathname === '/profile' },
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-20 sticky top-0 bg-background/50 backdrop-blur-md z-50 border-b border-border shrink-0">
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">DataCraft</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium whitespace-nowrap",
                  (link.active !== undefined ? link.active : location.pathname === link.href)
                    ? "text-[#E87B64]" 
                    : "text-foreground/70 hover:text-primary"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>

      {/* Sidebar + Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar 
          history={history}
          onSelectDataset={onSelectDataset}
          onDeleteDataset={onDeleteDataset}
          currentDatasetId={currentDatasetId}
        />
        
        <main className="flex-1 overflow-auto grid-pattern">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;