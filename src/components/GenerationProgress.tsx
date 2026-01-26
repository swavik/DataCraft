import { Loader2, CheckCircle, Sparkles, Brain, BarChart } from "lucide-react";
import { GenerationProgress as ProgressType } from "@/types/dataset";
import { Progress } from "./ui/progress";

interface GenerationProgressProps {
  progress: ProgressType;
}

const GenerationProgress = ({ progress }: GenerationProgressProps) => {
  const stages = [
    { id: 'analyzing', label: 'Analyzing Data', icon: BarChart },
    { id: 'training', label: 'Training CTGAN', icon: Brain },
    { id: 'generating', label: 'Generating Synthetic Data', icon: Sparkles },
    { id: 'evaluating', label: 'Evaluating Quality', icon: CheckCircle },
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(s => s.id === progress.stage);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center animate-pulse-glow">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
        <div>
          <h3 className="font-semibold">Generating Synthetic Data</h3>
          <p className="text-sm text-muted-foreground">{progress.message}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-mono text-primary">{Math.round(progress.progress)}%</span>
        </div>
        <Progress value={progress.progress} className="h-2" />
      </div>
      
      
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const currentIndex = getCurrentStageIndex();
          const isComplete = index < currentIndex || progress.stage === 'complete';
          const isCurrent = index === currentIndex;
          
          return (
            <div 
              key={stage.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isCurrent ? 'bg-primary/10 border border-primary/30' : 
                isComplete ? 'bg-success/5' : 'opacity-40'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isComplete ? 'bg-success/20' : isCurrent ? 'bg-primary/20' : 'bg-muted'
              }`}>
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <stage.icon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                isComplete ? 'text-success' : isCurrent ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationProgress;
