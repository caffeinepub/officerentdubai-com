import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Maximize2, DollarSign, Bath } from 'lucide-react';
import type { Property } from '../../backend';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.images.length > 0 
    ? property.images[0].getDirectURL() 
    : '/assets/generated/icon-office.dim_256x256.png';

  const propertyTypeLabel = property.propertyType === 'office' ? 'Office' : 'Retail';
  const propertyTypeIcon = property.propertyType === 'office' 
    ? '/assets/generated/icon-office.dim_256x256.png'
    : '/assets/generated/icon-retail.dim_256x256.png';

  return (
    <Link to="/listing/$id" params={{ id: property.id.toString() }}>
      <Card className="property-card overflow-hidden cursor-pointer h-full">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <Badge variant="secondary" className="shrink-0 gap-1">
              <img src={propertyTypeIcon} alt="" className="h-3 w-3" />
              {propertyTypeLabel}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {property.permitNumber && (
            <div className="text-xs text-muted-foreground">
              Permit: {property.permitNumber}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Maximize2 className="h-4 w-4" />
              <span>{property.areaSquareFeet.toString()} sqft</span>
            </div>
            {property.numberOfWashrooms > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Bath className="h-4 w-4" />
                <span>{property.numberOfWashrooms.toString()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>{property.price.toString()} AED</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
