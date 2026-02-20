import { useState } from 'react';
import { PropertyType, FurnishingStatus } from '../backend';
import PropertySearchBar from '../components/search/PropertySearchBar';
import PropertyCard from '../components/listings/PropertyCard';
import { useSearchProperties } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

export default function PublicListingsPage() {
  const [searchFilters, setSearchFilters] = useState<{
    locationSearchTerm?: string;
    propertyType?: PropertyType;
    furnishingStatus?: FurnishingStatus;
    minPrice?: bigint;
    maxPrice?: bigint;
    minArea?: bigint;
    maxArea?: bigint;
  }>({});

  const { data: properties = [], isLoading } = useSearchProperties(searchFilters);

  const handleSearch = (filters: {
    locationSearchTerm?: string;
    propertyType?: PropertyType;
    furnishingStatus?: FurnishingStatus;
    minPrice?: bigint;
    maxPrice?: bigint;
    minArea?: bigint;
    maxArea?: bigint;
  }) => {
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-background py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/generated/dubai-skyline-header-yellow.dim_1920x600.png)',
          }}
        >
          <div className="absolute inset-0 bg-primary/90" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Find Your Perfect Office or Retail Space in Dubai
            </h1>
            <p className="text-lg md:text-xl text-foreground">
              Discover premium commercial properties across Dubai's most sought-after locations
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <PropertySearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Available Properties
            </h2>
            <p className="text-foreground">
              {isLoading ? 'Loading...' : `${properties.length} properties found`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-foreground" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-foreground">No properties found matching your criteria.</p>
              <p className="text-sm text-foreground mt-2">Try adjusting your search filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id.toString()} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
