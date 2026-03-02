import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { agentCodeAuth } from '../../utils/agentCodeAuth';

interface AgentProtectedRouteProps {
  children: ReactNode;
}

export default function AgentProtectedRoute({ children }: AgentProtectedRouteProps) {
  const navigate = useNavigate();
  const isAuthorized = agentCodeAuth.isAuthorized();

  useEffect(() => {
    // Redirect to entry page if not authorized
    if (!isAuthorized) {
      navigate({ to: '/agent' });
    }
  }, [isAuthorized, navigate]);

  // Show access denied screen if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-4 bg-destructive/10 rounded-full w-fit">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription className="mt-2">
                You need to enter the agent code to access this area
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/agent">
              <Button className="w-full">Enter Agent Code</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
