import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Download, 
  Trash2, 
  Eye, 
  FileSpreadsheet, 
  Clock,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DatasetHistory } from '@/types/dataset';
import { format } from 'date-fns';

interface HistoryPageProps {
  history: DatasetHistory[];
  onSelectDataset: (dataset: DatasetHistory) => void;
  onDeleteDataset: (id: string) => void;
  onClearHistory: () => void;
}

const HistoryPage = ({ history, onSelectDataset, onDeleteDataset, onClearHistory }: HistoryPageProps) => {
  const navigate = useNavigate();
  
  const getQualityIcon = (level?: string) => {
    switch (level) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-warning" />;
      default: return <AlertTriangle className="w-4 h-4 text-destructive" />;
    }
  };

  const getQualityColor = (level?: string) => {
    switch (level) {
      case 'excellent': return 'bg-success/20 text-success';
      case 'good': return 'bg-warning/20 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewDataset = (dataset: DatasetHistory) => {
    onSelectDataset(dataset);
    if (dataset.hasSynthetic) {
      navigate('/results');
    } else {
      navigate('/preview');
    }
  };

  if (history.length === 0) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <History className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No History Yet</h2>
          <p className="text-muted-foreground mb-4">
            Upload a dataset to start generating synthetic data
          </p>
          <Button onClick={() => navigate('/upload')}>
            Upload Dataset
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Run History</h1>
              <p className="text-muted-foreground">
                {history.length} saved {history.length === 1 ? 'run' : 'runs'}
              </p>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all saved runs and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {history.map((dataset, index) => (
            <div 
              key={dataset.id}
              className="glass-card p-6 animate-slide-up hover:border-primary/30 transition-all"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">{dataset.fileName}</h3>
                      {dataset.hasSynthetic && dataset.qualityReport && (
                        <Badge className={getQualityColor(dataset.qualityReport.qualityLevel)}>
                          {getQualityIcon(dataset.qualityReport.qualityLevel)}
                          <span className="ml-1 capitalize">{dataset.qualityReport.qualityLevel}</span>
                        </Badge>
                      )}
                      {!dataset.hasSynthetic && (
                        <Badge variant="outline">No synthetic data</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(dataset.uploadedAt), 'MMM d, yyyy h:mm a')}
                      </span>
                      <span>{dataset.rowCount.toLocaleString()} rows</span>
                      <span>{dataset.columnCount} columns</span>
                    </div>

                    {/* Quality Metrics */}
                    {dataset.hasSynthetic && dataset.qualityReport && (
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Similarity:</span>
                          <span className="font-mono font-medium">
                            {(100 - dataset.qualityReport.accuracyDiff * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Real Acc:</span>
                          <span className="font-mono">{(dataset.qualityReport.realAccuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Synth Acc:</span>
                          <span className="font-mono">{(dataset.qualityReport.syntheticAccuracy * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewDataset(dataset)}
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  {dataset.realData && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => downloadCSV(dataset.realData!, `${dataset.fileName.replace('.csv', '')}_original.csv`)}
                      title="Download original"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {dataset.syntheticData && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadCSV(dataset.syntheticData!, `${dataset.fileName.replace('.csv', '')}_synthetic.csv`)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Synthetic
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this run?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{dataset.fileName}" and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDeleteDataset(dataset.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
