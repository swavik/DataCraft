import { Link } from 'react-router-dom';
import { Database, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-full grid-pattern flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center animate-fade-in">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
          <Database className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          Generate{' '}
          <span className="gradient-text">Synthetic Data</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
          Transform your datasets into privacy-safe synthetic data using advanced CTGAN technology
        </p>

        {/* CTA Button */}
        <Button 
          asChild
          variant="glow" 
          size="xl"
          className="group"
        >
          <Link to="/upload">
            <Sparkles className="w-5 h-5" />
            Start Generating
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>

        {/* Learn More Link */}
        <p className="mt-8 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-primary transition-colors">
            Learn more about how it works →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
