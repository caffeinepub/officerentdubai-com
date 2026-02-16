import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { PropertyType } from '../../backend';

interface PropertySearchBarProps {
  onSearch: (filters: {
    location?: string;
    propertyType?: PropertyType;
    minPrice?: bigint;
    maxPrice?: bigint;
    minArea?: bigint;
    maxArea?: bigint;
  }) => void;
}

export default function PropertySearchBar({ onSearch }: PropertySearchBarProps) {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    const filters: {
      location?: string;
      propertyType?: PropertyType;
      minPrice?: bigint;
      maxPrice?: bigint;
      minArea?: bigint;
      maxArea?: bigint;
    } = {};

    if (location.trim()) filters.location = location.trim();
    if (propertyType) filters.propertyType = propertyType;
    if (minArea) filters.minArea = BigInt(minArea);
    if (maxArea) filters.maxArea = BigInt(maxArea);
    if (minPrice) filters.minPrice = BigInt(minPrice);
    if (maxPrice) filters.maxPrice = BigInt(maxPrice);

    onSearch(filters);
  };

  return (
    <div className="search-container rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Downtown Dubai"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select value={propertyType} onValueChange={(value) => setPropertyType(value as PropertyType)}>
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PropertyType.office}>
                <div className="flex items-center gap-2">
                  <img src="/assets/generated/icon-office.dim_256x256.png" alt="" className="h-4 w-4" />
                  Office
                </div>
              </SelectItem>
              <SelectItem value={PropertyType.retail}>
                <div className="flex items-center gap-2">
                  <img src="/assets/generated/icon-retail.dim_256x256.png" alt="" className="h-4 w-4" />
                  Retail
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area Range */}
        <div className="space-y-2">
          <Label>Area (SQFT)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
            />
            <Input
              placeholder="Max"
              type="number"
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price (AED)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              placeholder="Max"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleSearch} size="lg" className="gap-2 px-8">
          <Search className="h-5 w-5" />
          Search Properties
        </Button>
      </div>
    </div>
  );
}
