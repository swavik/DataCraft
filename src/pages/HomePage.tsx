import { Link } from 'react-router-dom';
import { Database, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="max-w-3xl mx-auto text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg cursor-default">
          <Database className="w-10 h-10 text-white" />
        </div>

        {/* DataCraft - Increased Size */}
        <div className="mb-4">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text cursor-default">
            DataCraft
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-accent mx-auto mt-3 rounded-full" />
        </div>

        {/* Main Title - Decreased size for the first part, Black for the second */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground tracking-tight">
          Generate <span className="text-black">Synthetic Data</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
          Transform your datasets into privacy-safe synthetic data using advanced CTGAN technology
        </p>

        {/* CTA Button */}
        <Button 
          asChild
          variant="glow" 
          size="xl"
          className="group rounded-2xl px-10"
        >
          <Link to="/upload">
            <Sparkles className="w-5 h-5" />
            Start Generating
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;