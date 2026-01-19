import { useState } from 'react';
import { Brain, Lightbulb, ChevronDown, ChevronUp, Sparkles, Zap, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelRecommendation as ModelRec, ModelType, getModelInfo, recommendModel } from '@/utils/modelRecommendation';
import { DatasetStats } from '@/types/dataset';
import { cn } from '@/lib/utils';

interface ModelRecommendationProps {
  stats: DatasetStats;
  columnNames: string[];
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

const ModelRecommendation = ({ stats, columnNames, selectedModel, onModelChange }: ModelRecommendationProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const recommendation = recommendModel(stats, columnNames);
  const selectedModelInfo = getModelInfo(selectedModel);
  
  const modelIcons = {
    CTGAN: <Brain className="w-5 h-5" />,
    TVAE: <TrendingUp className="w-5 h-5" />,
    GaussianCopula: <Zap className="w-5 h-5" />
  };

  const confidenceColors = {
    high: 'bg-success/20 text-success',
    medium: 'bg-warning/20 text-warning',
    low: 'bg-muted text-muted-foreground'
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Model Recommendation</h3>
          <p className="text-sm text-muted-foreground">AI-powered model selection</p>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className={cn(
        "p-4 rounded-xl border-2 transition-all",
        selectedModel === recommendation.model 
          ? "border-primary/50 bg-primary/5" 
          : "border-border bg-muted/20"
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              <span className="font-semibold">Recommended: {recommendation.model}</span>
              <Badge className={cn("text-xs", confidenceColors[recommendation.confidence])}>
                {recommendation.confidence} confidence
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {recommendation.reason}
            </p>
          </div>
          {selectedModel !== recommendation.model && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onModelChange(recommendation.model)}
              className="shrink-0"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Use
            </Button>
          )}
        </div>
      </div>

      {/* Model Selector */}
      <div>
        <label className="text-sm font-medium mb-2 block">Select Model</label>
        <Select value={selectedModel} onValueChange={(v) => onModelChange(v as ModelType)}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                {modelIcons[selectedModel]}
                <span>{selectedModel}</span>
                {selectedModel === recommendation.model && (
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                )}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(['CTGAN', 'TVAE', 'GaussianCopula'] as ModelType[]).map((model) => (
              <SelectItem key={model} value={model}>
                <div className="flex items-center gap-2">
                  {modelIcons[model]}
                  <span>{model}</span>
                  {model === recommendation.model && (
                    <Badge variant="secondary" className="text-xs ml-2">Recommended</Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Model Info */}
      <div className="pt-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          <span>About {selectedModel}</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showDetails && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3 animate-fade-in">
            <div>
              <p className="text-sm font-medium text-foreground">{selectedModelInfo.fullName}</p>
              <p className="text-sm text-muted-foreground mt-1">{selectedModelInfo.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-success mb-1">✓ Strengths</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {selectedModelInfo.pros.map((pro, i) => (
                    <li key={i}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-destructive mb-1">✗ Limitations</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {selectedModelInfo.cons.map((con, i) => (
                    <li key={i}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-medium text-primary mb-1">Best For</p>
              <div className="flex flex-wrap gap-1">
                {selectedModelInfo.bestFor.map((use, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{use}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alternative Models */}
      {recommendation.alternativeModels.length > 0 && selectedModel === recommendation.model && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Alternative options:</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.alternativeModels.map((alt) => (
              <button
                key={alt.model}
                onClick={() => onModelChange(alt.model)}
                className="text-xs px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title={alt.reason}
              >
                {alt.model}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelRecommendation;
