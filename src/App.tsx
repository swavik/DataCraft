import { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";
import SyntheticDataPage from "./pages/SyntheticDataPage";
import ResultsPage from "./pages/ResultsPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useDatasetHistory } from "./hooks/useDatasetHistory";
import { DatasetHistory } from "./types/dataset";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const { history, addToHistory, updateDataset, removeFromHistory, getDataset } = useDatasetHistory();
  const [currentDatasetId, setCurrentDatasetId] = useState<string | undefined>();
  const currentDataset = currentDatasetId ? getDataset(currentDatasetId) : undefined;

  const handleDatasetReady = useCallback((dataset: DatasetHistory) => {
    addToHistory(dataset);
    setCurrentDatasetId(dataset.id);
  }, [addToHistory]);

  const handleSelectDataset = useCallback((id: string) => {
    setCurrentDatasetId(id);
    const dataset = getDataset(id);
    if (dataset?.hasSynthetic) {
      navigate('/synthetic');
    } else if (dataset?.realData) {
      navigate('/preview');
    }
  }, [getDataset, navigate]);

  const handleDatasetUpdate = useCallback((updates: Partial<DatasetHistory>) => {
    if (currentDatasetId) {
      updateDataset(currentDatasetId, updates);
    }
  }, [currentDatasetId, updateDataset]);

  const handleGenerationComplete = useCallback(() => {
    // Refresh the dataset from history after update
  }, []);

  // Get fresh dataset after updates
  const freshDataset = currentDatasetId ? getDataset(currentDatasetId) : undefined;

  return (
    <Routes>
      {/* Auth page - default landing page */}
      <Route path="/" element={<AuthPage />} />
      
      {/* Main app routes with MainLayout */}
      <Route path="/*" element={
        <MainLayout
          history={history}
          onSelectDataset={handleSelectDataset}
          onDeleteDataset={removeFromHistory}
          currentDatasetId={currentDatasetId}
        >
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage onDatasetReady={handleDatasetReady} />} />
            <Route 
              path="/preview" 
              element={
                <PreviewPage 
                  dataset={freshDataset || null} 
                  onDatasetUpdate={handleDatasetUpdate}
                  onGenerationComplete={handleGenerationComplete}
                />
              } 
            />
            <Route path="/synthetic" element={<SyntheticDataPage dataset={freshDataset || null} />} />
            <Route path="/results" element={<ResultsPage dataset={freshDataset || null} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
