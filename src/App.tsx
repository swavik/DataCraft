import { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";
import SyntheticDataPage from "./pages/SyntheticDataPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import { useDatasetHistory } from "./hooks/useDatasetHistory";
import { useUserProfile } from "./hooks/useUserProfile";
import { DatasetHistory } from "./types/dataset";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const { history, addToHistory, updateDataset, removeFromHistory, getDataset, clearHistory } = useDatasetHistory();
  const { addAction } = useUserProfile();
  const [currentDatasetId, setCurrentDatasetId] = useState<string | undefined>();
  const currentDataset = currentDatasetId ? getDataset(currentDatasetId) : undefined;

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('dataCraft_currentUserEmail');
    window.dispatchEvent(new CustomEvent('user-changed'));
    navigate('/auth');
  };

  const handleDatasetReady = useCallback((dataset: DatasetHistory) => {
    addToHistory(dataset);
    setCurrentDatasetId(dataset.id);
    addAction({
      type: 'upload',
      description: `Uploaded dataset "${dataset.fileName}" with ${dataset.rowCount} rows`,
    });
  }, [addToHistory, addAction]);

  const handleSelectDataset = useCallback((dataset: DatasetHistory) => {
    setCurrentDatasetId(dataset.id);
    addAction({
      type: 'view',
      description: `Viewed dataset "${dataset.fileName}"`,
    });
    if (dataset.hasSynthetic) {
      navigate('/synthetic');
    } else if (dataset.realData) {
      navigate('/preview');
    }
  }, [navigate, addAction]);

  const handleSelectDatasetById = useCallback((id: string) => {
    const dataset = getDataset(id);
    if (dataset) {
      handleSelectDataset(dataset);
    }
  }, [getDataset, handleSelectDataset]);

  const handleDatasetUpdate = useCallback((updates: Partial<DatasetHistory>) => {
    if (currentDatasetId) {
      updateDataset(currentDatasetId, updates);
      if (updates.hasSynthetic) {
        const dataset = getDataset(currentDatasetId);
        if (dataset) {
          addAction({
            type: 'generate',
            description: `Generated synthetic data for "${dataset.fileName}"`,
          });
        }
      }
    }
  }, [currentDatasetId, updateDataset, getDataset, addAction]);

  const handleGenerationComplete = useCallback(() => {
    // Refresh the dataset from history after update
  }, []);

  // Get fresh dataset after updates
  const freshDataset = currentDatasetId ? getDataset(currentDatasetId) : undefined;

  return (
    <Routes>
      {/* Landing page as root */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/documentation" element={<Documentation />} />
      
      {/* Main app routes with MainLayout */}
      <Route path="/*" element={
        isLoggedIn ? (
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
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
              <Route 
                path="/history" 
                element={
                  <HistoryPage 
                    history={history}
                    onSelectDataset={handleSelectDataset}
                    onDeleteDataset={removeFromHistory}
                    onClearHistory={clearHistory}
                  />
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        ) : (
          <AuthPage onLogin={handleLogin} />
        )
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
