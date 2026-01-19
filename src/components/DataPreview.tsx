import { useState } from "react";
import { Table, ChevronLeft, ChevronRight, Database, Hash, Type, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { DatasetStats, DatasetColumn } from "@/types/dataset";

interface DataPreviewProps {
  data: any[];
  stats: DatasetStats;
}

const DataPreview = ({ data, stats }: DataPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  
  const displayData = data.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );
  
  const columns = Object.keys(data[0] || {});

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'numerical': return <Hash className="w-3 h-3" />;
      case 'categorical': return <Type className="w-3 h-3" />;
      case 'datetime': return <Calendar className="w-3 h-3" />;
      default: return <Type className="w-3 h-3" />;
    }
  };

  const getColumnType = (colName: string): DatasetColumn | undefined => {
    return stats.columnInfo.find(c => c.name === colName);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Table className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Data Preview</h3>
            <p className="text-sm text-muted-foreground">
              {stats.rows.toLocaleString()} rows × {stats.columns} columns
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map(col => {
                const colInfo = getColumnType(col);
                return (
                  <th key={col} className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {colInfo && (
                        <span className={`p-1 rounded ${
                          colInfo.type === 'numerical' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'
                        }`}>
                          {getTypeIcon(colInfo.type)}
                        </span>
                      )}
                      {col}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, idx) => (
              <tr key={idx} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                    {row[col] !== undefined && row[col] !== null ? String(row[col]) : (
                      <span className="text-muted-foreground italic">null</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Missing values:</span>
            <span className={stats.missingTotal > 0 ? 'text-warning font-medium' : 'text-success font-medium'}>
              {stats.missingTotal}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Hash className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Numerical:</span>
            <span className="font-medium">{stats.numericalColumns.length}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Type className="w-4 h-4 text-warning" />
            <span className="text-muted-foreground">Categorical:</span>
            <span className="font-medium">{stats.categoricalColumns.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreview;
