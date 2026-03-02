import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Plus, List, LogOut } from 'lucide-react';
import { useGetAllProperties } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import AgentProtectedRoute from '../../components/auth/AgentProtectedRoute';
import { agentCodeAuth } from '../../utils/agentCodeAuth';

function AgentDashboardContent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: properties = [] } = useGetAllProperties();

  const handleLogout = () => {
    agentCodeAuth.clearAuthorization();
    queryClient.clear();
    navigate({ to: '/agent' });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agent Dashboard</h1>
            <p className="text-foreground mt-1">
              Welcome back, Agent
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4 text-foreground" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                Total Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{properties.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                Office Spaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {properties.filter(p => p.propertyType === 'office').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                Retail Spaces
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {properties.filter(p => p.propertyType === 'retail').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-2">
                <Plus className="h-6 w-6 text-foreground" />
              </div>
              <CardTitle className="text-foreground">Add New Property</CardTitle>
              <CardDescription className="text-foreground">
                List a new office or retail space for rent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/agent/properties/new">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4 text-foreground" />
                  Create Listing
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-2">
                <List className="h-6 w-6 text-foreground" />
              </div>
              <CardTitle className="text-foreground">Manage Properties</CardTitle>
              <CardDescription className="text-foreground">
                View, edit, or remove your existing listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/agent/properties">
                <Button variant="outline" className="w-full gap-2">
                  <List className="h-4 w-4 text-foreground" />
                  View All Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AgentDashboardPage() {
  return (
    <AgentProtectedRoute>
      <AgentDashboardContent />
    </AgentProtectedRoute>
  );
}
