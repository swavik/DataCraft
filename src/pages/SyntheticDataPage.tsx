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
  Check,
  File
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const val = row[h];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val ?? '');
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

  const downloadJSON = (data: Record<string, unknown>[], filename: string) => {
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

  const downloadTXT = (data: Record<string, unknown>[], filename: string) => {
    const headers = Object.keys(data[0]);
    const txt = [
      headers.join('\t'),
      ...data.map(row => headers.map(h => String(row[h] ?? '')).join('\t'))
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

  const downloadPDF = (data: Record<string, unknown>[], filename: string) => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.setTextColor(63, 81, 181);
    doc.text('DataCraft AI - Synthetic Data Export', 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dataset: ${dataset.fileName}`, 14, 22);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 27);
    doc.text(`Records: Showing first 100 of ${data.length.toLocaleString()}`, 14, 32);
    
    const headers = Object.keys(data[0]);
    const body = data.slice(0, 100).map(row => headers.map(h => String(row[h] ?? '')));
    
    autoTable(doc, {
      startY: 38,
      head: [headers],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [63, 81, 181], fontSize: 8 },
      bodyStyles: { fontSize: 7 },
      margin: { top: 38 },
      didDrawPage: (data) => {
        // Add footer on each page
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`, 
          pageWidth - 20, 
          doc.internal.pageSize.getHeight() - 10
        );
      }
    });
    
    doc.save(filename);
    setDownloadedFormat('pdf');
  };

  const previewSynthetic = dataset.syntheticData.slice(0, 10);
  const previewReal = dataset.realData ? dataset.realData.slice(0, 10) : [];
  const columns = Object.keys(previewSynthetic[0] || previewReal[0] || {});

  return (
    <div className="min-h-full p-8">
      <div className="max-w-[1600px] mx-auto">
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
                <DropdownMenuItem onClick={() => downloadPDF(dataset.syntheticData!, 'synthetic_data.pdf')}>
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Side-by-Side Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Real Data Preview */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/30">
              <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">Real Data Preview</h3>
                <p className="text-sm text-muted-foreground">Original dataset (Top 10 rows)</p>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead className="w-12 bg-card">#</TableHead>
                    {columns.map((col) => (
                      <TableHead key={col} className="whitespace-nowrap bg-card">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewReal.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      {columns.map((col) => {
                        const colInfo = dataset.stats?.columnInfo.find(c => c.name === col);
                        const precision = colInfo?.precision ?? 2;
                        return (
                          <TableCell key={col} className="font-mono text-xs">
                            {typeof row[col] === 'number' 
                              ? Number(row[col]).toFixed(precision) 
                              : String(row[col] ?? '').slice(0, 20)
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Synthetic Data Preview */}
          <div className="glass-card overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
            <div className="p-4 border-b border-border flex items-center gap-3 bg-primary/5">
              <Eye className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold">Synthetic Data Preview</h3>
                <p className="text-sm text-muted-foreground">Generated dataset (Top 10 rows)</p>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead className="w-12 bg-card">#</TableHead>
                    {columns.map((col) => (
                      <TableHead key={col} className="whitespace-nowrap bg-card">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewSynthetic.map((row, idx) => (
                    <TableRow key={idx} className="bg-primary/[0.02]">
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      {columns.map((col) => {
                        const colInfo = dataset.stats?.columnInfo.find(c => c.name === col);
                        const precision = colInfo?.precision ?? 2;
                        return (
                          <TableCell key={col} className="font-mono text-xs text-primary/90">
                            {typeof row[col] === 'number' 
                              ? Number(row[col]).toFixed(precision) 
                              : String(row[col] ?? '').slice(0, 20)
                            }
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyntheticDataPage;
