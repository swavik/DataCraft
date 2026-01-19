import { useState } from "react";
import { Settings, Zap, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface GenerationConfigProps {
  rowCount: number;
  onGenerate: (config: GenerationConfigType) => void;
  isGenerating: boolean;
}

export interface GenerationConfigType {
  numSamples: number;
  epochs: number;
}

const GenerationConfig = ({ rowCount, onGenerate, isGenerating }: GenerationConfigProps) => {
  const [numSamples, setNumSamples] = useState(rowCount);
  const [epochs, setEpochs] = useState(300);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Generation Settings</h3>
          <p className="text-sm text-muted-foreground">Configure CTGAN parameters</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Number of Samples */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Synthetic Samples</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of synthetic records to generate</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-mono text-primary">{numSamples.toLocaleString()}</span>
          </div>
          <Slider
            value={[numSamples]}
            onValueChange={([value]) => setNumSamples(value)}
            min={100}
            max={Math.max(rowCount * 2, 10000)}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>100</span>
            <span>{Math.max(rowCount * 2, 10000).toLocaleString()}</span>
          </div>
        </div>

        {/* Training Epochs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Training Epochs</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>More epochs = better quality but longer training</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-mono text-primary">{epochs}</span>
          </div>
          <Slider
            value={[epochs]}
            onValueChange={([value]) => setEpochs(value)}
            min={100}
            max={500}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>100 (Fast)</span>
            <span>500 (High Quality)</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          variant="glow" 
          size="lg" 
          className="w-full mt-4"
          onClick={() => onGenerate({ numSamples, epochs })}
          disabled={isGenerating}
        >
          <Zap className="w-5 h-5 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Synthetic Data'}
        </Button>
      </div>
    </div>
  );
};

export default GenerationConfig;
