import { useParams } from '@tanstack/react-router';
import { useGetPropertyById } from '../hooks/useQueries';
import { Loader2, MapPin, Maximize2, DollarSign, ArrowLeft, Bath, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import PropertyImageGallery from '../components/listings/PropertyImageGallery';
import ContactAgentButton from '../components/listings/ContactAgentButton';
import { FurnishingStatus } from '../backend';

export default function ListingDetailsPage() {
  const { id } = useParams({ from: '/listing/$id' });
  const { data: property, isLoading } = useGetPropertyById(id);

  if (isLoading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Listing Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>
    );
  }

  const propertyTypeLabel = property.propertyType === 'office' ? 'Office' : 'Retail';
  const propertyTypeIcon = property.propertyType === 'office' 
    ? '/assets/generated/icon-office.dim_256x256.png'
    : '/assets/generated/icon-retail.dim_256x256.png';

  const getFurnishingLabel = (status: FurnishingStatus): string => {
    switch (status) {
      case FurnishingStatus.furnished:
        return 'Furnished';
      case FurnishingStatus.semiFurnished:
        return 'Semi-Furnished';
      case FurnishingStatus.unfurnished:
        return 'Unfurnished';
      default:
        return 'N/A';
    }
  };

  // Construct the full listing URL for WhatsApp sharing
  const listingUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container py-8 max-w-6xl">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <PropertyImageGallery images={property.images} title={property.title} />

            {/* Property Details */}
            <div className="bg-card rounded-lg p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold">{property.title}</h1>
                  <Badge variant="secondary" className="gap-1 shrink-0">
                    <img src={propertyTypeIcon} alt="" className="h-4 w-4" />
                    {propertyTypeLabel}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Maximize2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="text-xl font-semibold">{property.areaSquareFeet.toString()} sqft</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-semibold">{property.price.toString()} AED</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Furnishing Status</p>
                  <p className="font-medium">{getFurnishingLabel(property.furnishingStatus)}</p>
                </div>
                {property.numberOfWashrooms > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Washrooms</p>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-primary" />
                      <p className="font-medium">{property.numberOfWashrooms.toString()}</p>
                    </div>
                  </div>
                )}
                {property.permitNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Permit Number</p>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <p className="font-medium">{property.permitNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 sticky top-20 space-y-4">
              <h3 className="text-xl font-semibold">Interested in this property?</h3>
              <p className="text-sm text-muted-foreground">
                Contact our agent to schedule a viewing or get more information.
              </p>
              <ContactAgentButton propertyTitle={property.title} listingUrl={listingUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
