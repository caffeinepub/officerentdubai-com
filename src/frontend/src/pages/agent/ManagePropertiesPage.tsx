import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { useGetAllProperties, useDeleteProperty } from '../../hooks/useQueries';
import { toast } from 'sonner';
import AgentProtectedRoute from '../../components/auth/AgentProtectedRoute';
import { normalizeBackendError } from '../../utils/backendError';

function ManagePropertiesContent() {
  const { data: properties = [], isLoading } = useGetAllProperties();
  const deleteProperty = useDeleteProperty();

  const handleDelete = async (id: bigint, title: string) => {
    try {
      await deleteProperty.mutateAsync(id);
      toast.success(`Property "${title}" deleted successfully`);
    } catch (error: any) {
      const normalized = normalizeBackendError(error);
      
      console.error('Property deletion error:', {
        normalizedMessage: normalized.message,
        isAuthError: normalized.isAuthorizationError,
        originalError: normalized.originalError,
      });

      // Show appropriate error message based on error type
      if (normalized.isAuthorizationError) {
        toast.error('Invalid agent code. Please return to /agent and enter your agent code again.');
      } else if (normalized.message && normalized.message !== 'An unexpected error occurred') {
        // Show the specific backend error message
        toast.error(normalized.message);
      } else {
        // Fallback to generic message
        toast.error('Failed to delete property');
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/agent/dashboard">
              <Button variant="ghost" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Manage Properties</h1>
            <p className="text-muted-foreground mt-1">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
            </p>
          </div>
          <Link to="/agent/properties/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-lg text-muted-foreground mb-4">
                You haven't listed any properties yet
              </p>
              <Link to="/agent/properties/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const imageUrl = property.images.length > 0 
                ? property.images[0].getDirectURL() 
                : '/assets/generated/icon-office.dim_256x256.png';
              const propertyTypeLabel = property.propertyType === 'office' ? 'Office' : 'Retail';

              return (
                <Card key={property.id.toString()} className="overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                      <Badge variant="secondary" className="shrink-0">
                        {propertyTypeLabel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {property.location}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        AED {Number(property.price).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/year</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Number(property.areaSquareFeet).toLocaleString()} sq ft
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Link 
                      to="/agent/properties/edit/$id" 
                      params={{ id: property.id.toString() }}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Property</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{property.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(property.id, property.title)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManagePropertiesPage() {
  return (
    <AgentProtectedRoute>
      <ManagePropertiesContent />
    </AgentProtectedRoute>
  );
}
