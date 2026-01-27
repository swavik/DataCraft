import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Database, LayoutDashboard, User, Settings, HelpCircle, Sparkles, LogOut } from 'lucide-react';
import AppSidebar from './AppSidebar';
import { DatasetHistory } from '@/types/dataset';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const { user, logout } = useAuth();

  const userInitials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

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
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6">
          <nav className="flex items-center gap-1">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            
            <div className="w-px h-4 bg-border mx-2" />
            
            <Link 
              to="/dashboard" 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                location.pathname === '/dashboard' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <Link 
              to="/home" 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                location.pathname === '/home' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Generate
            </Link>

            <Link 
              to="/genai" 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                location.pathname === '/genai' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              GenAI
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground" asChild>
              <Link to="/documentation">
                <HelpCircle className="w-5 h-5" />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 border border-border overflow-hidden p-0">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive flex items-center cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
