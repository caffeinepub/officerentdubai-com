import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'officerentdubai';

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-sm text-foreground">
            © {currentYear} OfficeRentDubai.com. All rights reserved.
          </p>
          <p className="text-sm text-foreground flex items-center gap-1">
            Built with <Heart className="h-4 w-4 text-foreground fill-foreground stroke-foreground" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:opacity-70 transition-opacity text-foreground underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
