import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Generate <span className="text-primary">Synthetic Data</span>
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Transform your datasets into privacy-safe synthetic data using CTGAN technology.
          </p>
          
          <Button variant="glow" size="lg" onClick={onGetStarted}>
            Upload Dataset
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
