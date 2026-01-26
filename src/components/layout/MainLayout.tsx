import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Database, LogOut, User, Info } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { DatasetHistory } from '@/types/dataset';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const generatePath = currentDatasetId ? "/preview" : "/upload";
  const isGenerateActive = ['/upload', '/preview', '/synthetic'].includes(location.pathname);

  return (
    <div className="h-screen w-full overflow-hidden bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center h-full">
          {/* LOGO SECTION: Width set to w-16 to match the collapsed sidebar exactly */}
          <div className="w-16 flex items-center justify-center border-r border-transparent">
            <Link to="/home" className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-sm">
                <Database className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
          
          {/* TEXT SECTION: Separated so it sits to the right of the logo 'column' */}
          <div className="pl-3">
            <span className="text-lg font-bold tracking-tight text-foreground">DataCraft</span>
          </div>
        </div>
        
        {/* Right side navigation items */}
        <div className="flex items-center gap-4 px-6">
          <Link 
            to="/home" 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              location.pathname === '/home' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          <Link 
            to={generatePath} 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              isGenerateActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Database className="w-4 h-4" />
            Generate
          </Link>

          <Link 
            to="/about" 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              location.pathname === '/about' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Info className="w-4 h-4" />
            About
          </Link>
          
          <Link 
            to="/profile" 
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              location.pathname === '/profile' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <User className="w-4 h-4" />
            Account
          </Link>

          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 ml-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
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
        
        <main className="flex-1 overflow-auto bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;