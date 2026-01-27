import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, Loader2, Database, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatasetHistory } from '@/types/dataset';
import { analyzeDataset } from '@/utils/syntheticGenerator';

interface PromptToDatasetPageProps {
  onDatasetReady: (dataset: DatasetHistory) => void;
}

const PromptToDatasetPage = ({ onDatasetReady }: PromptToDatasetPageProps) => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [rowCount, setRowCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt describing the dataset you want.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate GenAI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Mock generated data based on a generic structure
      // In a real app, this would call an LLM API to get the schema and data
      const mockData: Record<string, unknown>[] = [];
      const columns = ['id', 'name', 'email', 'category', 'value', 'status'];
      
      for (let i = 0; i < rowCount; i++) {
        mockData.push({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          category: ['Health', 'Finance', 'Tech', 'Retail'][Math.floor(Math.random() * 4)],
          value: Math.floor(Math.random() * 10000) / 100,
          status: ['Active', 'Pending', 'Inactive'][Math.floor(Math.random() * 3)]
        });
      }

      const stats = analyzeDataset(mockData);
      
      const dataset: DatasetHistory = {
        id: `genai_${Date.now()}`,
        fileName: `AI_Generated_Dataset_${Date.now()}.csv`,
        uploadedAt: new Date().toISOString(),
        rowCount: mockData.length,
        columnCount: columns.length,
        hasSynthetic: false,
        realData: mockData,
        stats,
      };

      onDatasetReady(dataset);
      toast.success('Dataset generated successfully!');
      navigate('/preview');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate dataset. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-full p-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              GenAI Dataset Creator
            </h1>
            <p className="text-muted-foreground">
              Describe the dataset you need, and our AI will build it for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 animate-slide-up">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle>Dataset Prompt</CardTitle>
              <CardDescription>
                Describe the columns, data types, and purpose of the dataset.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Textarea
                  placeholder="e.g., Create a dataset for a healthcare application with patient names, age, diagnosis, and treatment costs. Include 100 records with realistic values."
                  className="min-h-[150px] text-lg resize-none focus-visible:ring-primary/20"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Rows</label>
                  <Input
                    type="number"
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value) || 0)}
                    min={1}
                    max={1000}
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-muted-foreground">Maximum 1,000 rows for AI generation</p>
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={handleGenerate} 
                    className="w-full gap-2 h-11 text-base font-semibold"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Dataset...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Generate Dataset
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PromptIdeaCard 
              title="Customer Churn"
              description="A dataset for predicting customer churn in a SaaS business."
              onClick={() => setPrompt("Create a SaaS customer churn dataset with user_id, signup_date, monthly_fee, last_login, usage_frequency, and churn_status.")}
            />
            <PromptIdeaCard 
              title="Medical Records"
              description="Electronic health records for testing clinical dashboards."
              onClick={() => setPrompt("Generate medical records dataset with patient_id, age, gender, blood_pressure, cholesterol, and diagnosis.")}
            />
            <PromptIdeaCard 
              title="Retail Sales"
              description="Daily transactions for a multi-store retail chain."
              onClick={() => setPrompt("Create retail sales data with transaction_id, store_location, product_category, quantity, unit_price, and date.")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptIdeaCard = ({ title, description, onClick }: { title: string, description: string, onClick: () => void }) => (
  <Card className="cursor-pointer hover:border-primary/50 transition-all hover:bg-primary/[0.02]" onClick={onClick}>
    <CardHeader className="p-4">
      <CardTitle className="text-sm flex items-center gap-2">
        <Database className="w-4 h-4 text-primary" />
        {title}
      </CardTitle>
      <CardDescription className="text-xs line-clamp-2">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
);

export default PromptToDatasetPage;
