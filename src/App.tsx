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
import HistoryPage from "./pages/HistoryPage";
import About from "./pages/About";
import Profile from "./pages/Profile"; // 1. Imported the new Profile page
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import { useDatasetHistory } from "./hooks/useDatasetHistory";
import { DatasetHistory } from "./types/dataset";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const { history, loading, addToHistory, updateDataset, removeFromHistory, getDataset, clearHistory } = useDatasetHistory();
  const [currentDatasetId, setCurrentDatasetId] = useState<string | undefined>();

  const handleDatasetReady = useCallback((dataset: DatasetHistory) => {
    addToHistory(dataset);
    setCurrentDatasetId(dataset.id);
  }, [addToHistory]);

  const handleSelectDataset = useCallback((dataset: DatasetHistory) => {
    setCurrentDatasetId(dataset.id);
    if (dataset.hasSynthetic) {
      navigate('/synthetic');
    } else if (dataset.realData) {
      navigate('/preview');
    }
  }, [navigate]);

  const handleSelectDatasetById = useCallback((id: string) => {
    const dataset = getDataset(id);
    if (dataset) {
      handleSelectDataset(dataset);
    }
  }, [getDataset, handleSelectDataset]);

  const handleDatasetUpdate = useCallback((updates: Partial<DatasetHistory>) => {
    if (currentDatasetId) {
      updateDataset(currentDatasetId, updates);
    }
  }, [currentDatasetId, updateDataset]);

  const handleGenerationComplete = useCallback(() => {
    // Logic for post-generation refresh if needed
  }, []);

  // Get fresh dataset after updates
  const freshDataset = currentDatasetId ? getDataset(currentDatasetId) : undefined;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <HomePage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/upload" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <UploadPage onDatasetReady={handleDatasetReady} />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/preview" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <PreviewPage 
              dataset={freshDataset || null} 
              onDatasetUpdate={handleDatasetUpdate}
              onGenerationComplete={handleGenerationComplete}
            />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/synthetic" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <SyntheticDataPage dataset={freshDataset || null} />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/results" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <ResultsPage dataset={freshDataset || null} />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/history" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <HistoryPage 
              history={history}
              onSelectDataset={handleSelectDataset}
              onDeleteDataset={removeFromHistory}
              onClearHistory={clearHistory}
            />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/about" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <About />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* 2. Added the Profile Route here */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <Profile />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;