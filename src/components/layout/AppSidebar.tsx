import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Database, 
  Upload, 
  History, 
  ChevronLeft, 
  ChevronRight,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatasetHistory } from '@/types/dataset';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  history: DatasetHistory[];
  onSelectDataset: (id: string) => void;
  onDeleteDataset: (id: string) => void;
  currentDatasetId?: string;
}

const AppSidebar = ({ 
  history, 
  onSelectDataset, 
  onDeleteDataset,
  currentDatasetId 
}: AppSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "h-screen bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[hsl(var(--sidebar-border))]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-foreground">DataCraft</span>
          )}
        </Link>
      </div>

      {/* New Dataset Button */}
      <div className="p-3">
        <Button 
          asChild
          variant="glow" 
          className={cn("w-full", isCollapsed && "px-0")}
        >
          <Link to="/upload">
            <Upload className="w-4 h-4" />
            {!isCollapsed && <span>New Dataset</span>}
          </Link>
        </Button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!isCollapsed && (
          <Link
            to="/history"
            className="mx-3 mb-2 px-3 py-2 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground hover:bg-muted rounded-lg transition-all"
          >
            <History className="w-3.5 h-3.5" />
            <span>View All History</span>
          </Link>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1">
          {history.length === 0 ? (
            !isCollapsed && (
              <div className="text-center py-8 px-4">
                <FileSpreadsheet className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No datasets yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Upload a CSV to get started</p>
              </div>
            )
          ) : (
            <div className="space-y-1">
              {history.map((dataset) => (
                <div
                  key={dataset.id}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                    currentDatasetId === dataset.id 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => onSelectDataset(dataset.id)}
                >
                  <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{dataset.fileName}</p>
                        <p className="text-xs opacity-70">{dataset.rowCount} rows</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDataset(dataset.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
