import { Search } from "lucide-react";

const QuickHireHeader = () => {
  return (
    <header className="w-full border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">Q</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground">QuickHire</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">Find Jobs</a>
            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors">Browse Companies</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Login</a>
          <button className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default QuickHireHeader;
