import { Link } from '@tanstack/react-router';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/assets/generated/officerentdubai-logo.dim_1200x300.png" 
            alt="OfficeRentDubai.com" 
            className="h-8 w-auto"
          />
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Properties
          </Link>
          <Link to="/agent">
            <Button variant="outline" size="sm" className="gap-2">
              <Building2 className="h-4 w-4" />
              Agent Arena
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
