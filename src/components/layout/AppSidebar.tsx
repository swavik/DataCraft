import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Upload, 
  History, 
  ChevronLeft, 
  ChevronRight,
  FileSpreadsheet,
  Trash2,
  ChevronDown,
  ChevronUp
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "h-[calc(100vh-3.5rem)] bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))] flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Action Section */}
      <div className="p-3">
        <div className={cn("flex flex-col gap-3", isCollapsed ? "items-center" : "items-stretch")}>
          
          {/* New Dataset Button: Logic to switch between Icon and Full Button */}
          <Button 
            asChild
            // Use 'ghost' for just the icon when collapsed, 'glow' for the full button when expanded
            variant={isCollapsed ? "ghost" : "glow"} 
            className={cn(
              "transition-all duration-300 flex items-center justify-center", 
              isCollapsed 
                ? "w-10 h-10 p-0 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" 
                : "w-full px-4 h-11"
            )}
            title="New Dataset"
          >
            <Link to="/upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">New Dataset</span>}
            </Link>
          </Button>

          {/* Collapsed-only History Icon - Matches the look of New Dataset above when collapsed */}
          {isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(false)}
              className="w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
              title="Open History"
            >
              <History className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* History List Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {!isCollapsed && (
          <>
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className={cn(
                "mx-3 mb-2 px-3 py-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all",
                isHistoryExpanded ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <History className="w-4 h-4" />
              <span>History</span>
              {isHistoryExpanded ? (
                <ChevronUp className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-auto" />
              )}
            </button>

            {isHistoryExpanded && (
              <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1">
                {history.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No datasets yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {history.map((dataset) => (
                      <div
                        key={dataset.id}
                        className={cn(
                          "group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all",
                          currentDatasetId === dataset.id 
                            ? "bg-primary/10 text-primary shadow-sm" 
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                        onClick={() => onSelectDataset(dataset.id)}
                      >
                        <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{dataset.fileName}</p>
                          <p className="text-xs opacity-60">{dataset.rowCount} rows</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDataset(dataset.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-destructive/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Toggle */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;