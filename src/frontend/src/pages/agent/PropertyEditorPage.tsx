import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetPropertyById, useCreateProperty, useUpdateProperty } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PropertyForm from '../../components/agent/PropertyForm';
import { toast } from 'sonner';
import AgentProtectedRoute from '../../components/auth/AgentProtectedRoute';
import type { PropertyType } from '../../backend';
import { ExternalBlob } from '../../backend';

function PropertyEditorContent() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const propertyId = 'id' in params ? params.id : undefined;
  const isEditMode = !!propertyId;

  const { data: property, isLoading } = useGetPropertyById(propertyId || '');
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();

  const handleSubmit = async (data: {
    title: string;
    location: string;
    propertyType: PropertyType;
    areaSquareFeet: string;
    price: string;
    description: string;
    images: ExternalBlob[];
  }) => {
    try {
      if (isEditMode && property) {
        await updateProperty.mutateAsync({
          propertyId: property.id,
          title: data.title,
          location: data.location,
          propertyType: data.propertyType,
          areaSquareFeet: BigInt(data.areaSquareFeet),
          price: BigInt(data.price),
          description: data.description,
          images: data.images,
        });
        toast.success('Property updated successfully');
      } else {
        await createProperty.mutateAsync({
          title: data.title,
          location: data.location,
          propertyType: data.propertyType,
          areaSquareFeet: BigInt(data.areaSquareFeet),
          price: BigInt(data.price),
          description: data.description,
          images: data.images,
        });
        toast.success('Property created successfully');
      }
      navigate({ to: '/agent/properties' });
    } catch (error: any) {
      // Check for authorization errors
      if (error?.message?.includes('Authorization required')) {
        toast.error('Authorization required. Please return to /agent and enter your agent code.');
      } else if (error?.message?.includes('Unauthorized')) {
        toast.error('Access denied. Please verify your agent code at /agent.');
      } else {
        toast.error(isEditMode ? 'Failed to update property' : 'Failed to create property');
      }
      console.error('Submit error:', error);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEditMode && !property) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <Link to="/agent/properties">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8 max-w-4xl">
        <Link to="/agent/properties">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode ? 'Update property details and photos' : 'Fill in the details to list a new property'}
          </p>
        </div>

        <PropertyForm
          initialData={property ? {
            title: property.title,
            location: property.location,
            propertyType: property.propertyType,
            areaSquareFeet: property.areaSquareFeet.toString(),
            price: property.price.toString(),
            description: property.description,
            images: property.images,
          } : undefined}
          onSubmit={handleSubmit}
          isSubmitting={createProperty.isPending || updateProperty.isPending}
          submitLabel={isEditMode ? 'Update Property' : 'Create Property'}
        />
      </div>
    </div>
  );
}

export default function PropertyEditorPage() {
  return (
    <AgentProtectedRoute>
      <PropertyEditorContent />
    </AgentProtectedRoute>
  );
}
