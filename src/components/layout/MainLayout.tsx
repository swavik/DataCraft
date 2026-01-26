import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Database } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { DatasetHistory } from '@/types/dataset';
import { cn } from '@/lib/utils';

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar 
        history={history}
        onSelectDataset={onSelectDataset}
        onDeleteDataset={onDeleteDataset}
        currentDatasetId={currentDatasetId}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-6">
          <nav className="flex items-center gap-4">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                location.pathname === '/' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
