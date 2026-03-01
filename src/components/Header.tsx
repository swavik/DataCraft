import { Database } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">DataCraft</h1>
          </Link>
          
          <Link 
            to="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
