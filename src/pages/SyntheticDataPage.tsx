import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  Eye,
  FileType,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { DatasetHistory } from '@/types/dataset';

interface SyntheticDataPageProps {
  dataset: DatasetHistory | null;
}

const SyntheticDataPage = ({ dataset }: SyntheticDataPageProps) => {
  const navigate = useNavigate();
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!dataset || !dataset.syntheticData) {
    return (
      <div className="min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <FileSpreadsheet className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No synthetic data available</h2>
          <p className="text-muted-foreground mb-4">Generate synthetic data first</p>
          <Button asChild>
            <a href="/preview">Go to Preview</a>
          </Button>
        </div>
      </div>
    );
  }

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
    setDownloadedFormat('csv');
  };

  const downloadJSON = (data: any[], filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedFormat('json');
  };

  const downloadTXT = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]);
    const txt = [
      headers.join('\t'),
      ...data.map(row => headers.map(h => row[h]).join('\t'))
    ].join('\n');
    
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedFormat('txt');
  };

  const previewData = dataset.syntheticData.slice(0, 10);
  const columns = Object.keys(previewData[0] || {});

  return (
    <div className="min-h-full p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/preview')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Synthetic Data Generated</h1>
              <p className="text-muted-foreground">
                {dataset.syntheticData.length.toLocaleString()} synthetic records ready for download
              </p>
            </div>
          </div>
          <Button onClick={() => navigate('/results')} className="gap-2">
            View Quality Results
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Download Section */}
        <div className="glass-card p-6 mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Download Synthetic Data</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred file format</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="glass" 
              size="lg" 
              className="h-auto py-4 flex-col gap-2 relative"
              onClick={() => downloadCSV(dataset.syntheticData!, 'synthetic_data.csv')}
            >
              {downloadedFormat === 'csv' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <FileSpreadsheet className="w-6 h-6 text-primary" />
              <span className="font-semibold">CSV</span>
              <span className="text-xs text-muted-foreground">Comma Separated</span>
            </Button>

            <Button 
              variant="glass" 
              size="lg" 
              className="h-auto py-4 flex-col gap-2 relative"
              onClick={() => downloadJSON(dataset.syntheticData!, 'synthetic_data.json')}
            >
              {downloadedFormat === 'json' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <FileType className="w-6 h-6 text-primary" />
              <span className="font-semibold">JSON</span>
              <span className="text-xs text-muted-foreground">JavaScript Object</span>
            </Button>

            <Button 
              variant="glass" 
              size="lg" 
              className="h-auto py-4 flex-col gap-2 relative"
              onClick={() => downloadTXT(dataset.syntheticData!, 'synthetic_data.txt')}
            >
              {downloadedFormat === 'txt' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <FileText className="w-6 h-6 text-primary" />
              <span className="font-semibold">TXT</span>
              <span className="text-xs text-muted-foreground">Tab Separated</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Download className="w-6 h-6 text-primary" />
                  <span className="font-semibold">More Formats</span>
                  <span className="text-xs text-muted-foreground">Excel, PDF...</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadCSV(dataset.syntheticData!, 'synthetic_data.xls')}>
                  Download as Excel (.xls)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  // For PDF, we'd need a library - showing CSV for now
                  downloadCSV(dataset.syntheticData!, 'synthetic_data.csv');
                  alert('For PDF export, please use the CSV and convert it using your preferred tool');
                }}>
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Data Preview */}
        <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-semibold">Synthetic Data Preview</h3>
              <p className="text-sm text-muted-foreground">First 10 rows of generated data</p>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col} className="whitespace-nowrap">{col}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    {columns.map((col) => (
                      <TableCell key={col} className="font-mono text-sm">
                        {typeof row[col] === 'number' 
                          ? row[col].toFixed(2) 
                          : String(row[col]).slice(0, 25)
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyntheticDataPage;
