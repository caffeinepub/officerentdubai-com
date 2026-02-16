import { useState } from 'react';
import PropertySearchBar from '../components/search/PropertySearchBar';
import PropertyCard from '../components/listings/PropertyCard';
import { useSearchProperties } from '../hooks/useQueries';
import type { PropertyType, FurnishingStatus } from '../backend';
import { Loader2 } from 'lucide-react';

export default function PublicListingsPage() {
  const [searchFilters, setSearchFilters] = useState<{
    location?: string;
    propertyType?: PropertyType;
    furnishingStatus?: FurnishingStatus;
    minPrice?: bigint;
    maxPrice?: bigint;
    minArea?: bigint;
    maxArea?: bigint;
  }>({});

  const [hasSearched, setHasSearched] = useState(false);

  const { data: properties = [], isLoading } = useSearchProperties(searchFilters);

  const handleSearch = (filters: {
    location?: string;
    propertyType?: PropertyType;
    furnishingStatus?: FurnishingStatus;
    minPrice?: bigint;
    maxPrice?: bigint;
    minArea?: bigint;
    maxArea?: bigint;
  }) => {
    setSearchFilters(filters);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section 
        className="hero-section relative py-20 px-4"
        style={{
          backgroundImage: 'url(/assets/generated/dubai-skyline-header.dim_1920x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Find Your Perfect Commercial Space in Dubai
            </h1>
            <p className="text-lg text-muted-foreground">
              Premium office and retail properties across Dubai's prime locations
            </p>
          </div>

          <PropertySearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="container max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : hasSearched && properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                No properties found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                  {hasSearched ? 'Search Results' : 'Featured Properties'}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id.toString()} property={property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">
                Use the search above to find properties
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
