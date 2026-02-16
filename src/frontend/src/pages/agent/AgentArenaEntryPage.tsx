import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Lock } from 'lucide-react';
import { agentCodeAuth } from '../../utils/agentCodeAuth';

export default function AgentArenaEntryPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already authorized, redirect to dashboard
    if (agentCodeAuth.isAuthorized()) {
      navigate({ to: '/agent/dashboard' });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Small delay for better UX
    setTimeout(() => {
      if (agentCodeAuth.authorize(code)) {
        navigate({ to: '/agent/dashboard' });
      } else {
        setError('Invalid agent code. Please check your code and try again.');
        setCode('');
      }
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit">
            <Building2 className="h-12 w-12 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Agent Arena</CardTitle>
            <CardDescription className="mt-2">
              Enter your agent code to access property management
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentCode">Agent Code</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="agentCode"
                  type="text"
                  placeholder="Enter your agent code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                  }}
                  className="pl-10"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting || !code.trim()}
            >
              {isSubmitting ? 'Verifying...' : 'Access Agent Arena'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
