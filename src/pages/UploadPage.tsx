import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { analyzeDataset } from '@/utils/syntheticGenerator';
import { DatasetHistory } from '@/types/dataset';

interface UploadPageProps {
  onDatasetReady: (dataset: DatasetHistory) => void;
}

const UploadPage = ({ onDatasetReady }: UploadPageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Your Dataset</h1>
          <p className="text-muted-foreground">
            Choose a CSV file to get started
          </p>
        </div>

        <div
          className={`glass-card p-12 border-2 border-dashed cursor-pointer ${
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
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
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
      </div>
    </div>
  );
};

export default UploadPage;
