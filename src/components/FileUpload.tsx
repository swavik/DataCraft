import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, X, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

interface FileUploadProps {
  onFileUpload: (file: File, data: Record<string, unknown>[]) => void;
  isUploaded: boolean;
  fileName?: string;
  onClear: () => void;
}

const FileUpload = ({ onFileUpload, isUploaded, fileName, onClear }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Try to parse as number
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
      
      onFileUpload(file, data);
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

  if (isUploaded) {
    return (
      <div className="glass-card p-6 border-success/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground">{fileName}</p>
              <p className="text-sm text-muted-foreground">Dataset uploaded successfully</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClear}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-card p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
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
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
          isDragging ? 'bg-primary/20' : 'bg-muted'
        }`}>
          {isProcessing ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {isProcessing ? 'Processing...' : 'Upload Your Dataset'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your CSV file here, or click to browse
        </p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Supports CSV format • Max 50MB</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
