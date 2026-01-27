import { useState, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";
import SyntheticDataPage from "./pages/SyntheticDataPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import PromptToDatasetPage from "./pages/PromptToDatasetPage";
import DocumentationPage from "./pages/DocumentationPage";
import NotFound from "./pages/NotFound";
import { useDatasetHistory } from "./hooks/useDatasetHistory";
import { DatasetHistory } from "./types/dataset";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, addToHistory, updateDataset, removeFromHistory, getDataset, clearHistory } = useDatasetHistory();
  const [currentDatasetId, setCurrentDatasetId] = useState<string | undefined>();
  const currentDataset = currentDatasetId ? getDataset(currentDatasetId) : undefined;

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
    // Refresh the dataset from history after update
  }, []);

  // Get fresh dataset after updates
  const freshDataset = currentDatasetId ? getDataset(currentDatasetId) : undefined;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      
      {/* Main app routes with MainLayout */}
      <Route path="/*" element={
        <ProtectedRoute>
          <MainLayout
            history={history}
            onSelectDataset={handleSelectDatasetById}
            onDeleteDataset={removeFromHistory}
            currentDatasetId={currentDatasetId}
          >
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/upload" element={<UploadPage onDatasetReady={handleDatasetReady} />} />
              <Route path="/genai" element={<PromptToDatasetPage onDatasetReady={handleDatasetReady} />} />
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
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
