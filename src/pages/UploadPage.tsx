import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, X, CheckCircle, Database, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sampleDatasets, getDatasetsByCategory } from '@/data/sampleDatasets';
import { analyzeDataset } from '@/utils/syntheticGenerator';
import { DatasetHistory, SampleDataset } from '@/types/dataset';

interface UploadPageProps {
  onDatasetReady: (dataset: DatasetHistory) => void;
}

const UploadPage = ({ onDatasetReady }: UploadPageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const categorizedDatasets = getDatasetsByCategory();

  const parseCSV = (text: string): Record<string, unknown>[] => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: Record<string, unknown>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        const value = values[index];
        const num = parseFloat(value);
        row[header] = isNaN(num) ? value : num;
      });
      data.push(row);
    }
    
    return data;
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        alert('The CSV file appears to be empty');
        return;
      }
      
      const stats = analyzeDataset(data);
      
      const dataset: DatasetHistory = {
        id: `dataset_${Date.now()}`,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        rowCount: data.length,
        columnCount: Object.keys(data[0]).length,
        hasSynthetic: false,
        realData: data,
        stats,
      };
      
      onDatasetReady(dataset);
      navigate('/preview');
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing the CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSampleDataset = (sample: SampleDataset) => {
    const stats = analyzeDataset(sample.data);
    
    const dataset: DatasetHistory = {
      id: `dataset_${Date.now()}`,
      fileName: sample.name + '.csv',
      uploadedAt: new Date().toISOString(),
      rowCount: sample.rowCount,
      columnCount: sample.columns.length,
      hasSynthetic: false,
      realData: sample.data,
      stats,
    };
    
    onDatasetReady(dataset);
    navigate('/preview');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Upload Your Dataset</h1>
          <p className="text-muted-foreground">
            Choose a CSV file or select from our sample datasets
          </p>
        </div>

        <Tabs defaultValue="upload" className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload CSV
            </TabsTrigger>
            <TabsTrigger value="samples" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Sample Datasets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div
              className={`glass-card p-12 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
                  isDragging ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  {isProcessing ? (
                    <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className={`w-10 h-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {isProcessing ? 'Processing...' : 'Drop your CSV file here'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  or click to browse your files
                </p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Supports CSV format • Max 50MB</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="samples">
            <div className="space-y-6">
              {Object.entries(categorizedDatasets).map(([category, datasets]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {datasets.map((dataset) => (
                      <button
                        key={dataset.id}
                        onClick={() => handleSampleDataset(dataset)}
                        className="glass-card p-4 text-left hover:border-primary/50 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                            <FileSpreadsheet className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {dataset.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {dataset.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{dataset.rowCount} rows</span>
                              <span>•</span>
                              <span>{dataset.columns.length} columns</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UploadPage;
