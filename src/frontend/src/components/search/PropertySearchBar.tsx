import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertCircle } from 'lucide-react';
import { PropertyType, FurnishingStatus } from '../../backend';
import { useLocationAutocompleteSuggestions } from '../../hooks/useLocationAutocompleteSuggestions';

interface PropertySearchBarProps {
  onSearch: (filters: {
    location?: string;
    propertyType?: PropertyType;
    furnishingStatus?: FurnishingStatus;
    minPrice?: bigint;
    maxPrice?: bigint;
    minArea?: bigint;
    maxArea?: bigint;
  }) => void;
}

export default function PropertySearchBar({ onSearch }: PropertySearchBarProps) {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [furnishingStatus, setFurnishingStatus] = useState<FurnishingStatus | ''>('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    suggestions,
    isLoading: suggestionsLoading,
    source,
    isGoogleConfigured,
  } = useLocationAutocompleteSuggestions(location);

  const handleSearch = () => {
    const filters: {
      location?: string;
      propertyType?: PropertyType;
      furnishingStatus?: FurnishingStatus;
      minPrice?: bigint;
      maxPrice?: bigint;
      minArea?: bigint;
      maxArea?: bigint;
    } = {};

    if (location.trim()) filters.location = location.trim();
    if (propertyType) filters.propertyType = propertyType;
    if (furnishingStatus) filters.furnishingStatus = furnishingStatus;
    if (minArea) filters.minArea = BigInt(minArea);
    if (maxArea) filters.maxArea = BigInt(maxArea);
    if (minPrice) filters.minPrice = BigInt(minPrice);
    if (maxPrice) filters.maxPrice = BigInt(maxPrice);

    onSearch(filters);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show suggestions when there are results
  useEffect(() => {
    if (suggestions.length > 0 && location.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions, location]);

  return (
    <div className="search-container rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location with Autocomplete */}
        <div className="space-y-2 relative">
          <Label htmlFor="location">Location</Label>
          <Input
            ref={inputRef}
            id="location"
            placeholder="e.g., Downtown Dubai"
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0 && location.trim().length > 0) {
                setShowSuggestions(true);
              }
            }}
            autoComplete="off"
          />
          {!isGoogleConfigured && location.trim().length > 0 && (
            <div className="flex items-start gap-2 mt-1 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>
                Google Places autocomplete is not configured. Using stored property locations.
              </span>
            </div>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors ${
                    index === highlightedIndex ? 'bg-accent text-accent-foreground' : ''
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(suggestion);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {suggestion}
                </button>
              ))}
              {source === 'google' && (
                <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
                  Powered by Google Places
                </div>
              )}
            </div>
          )}
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

        {/* Furnishing Status */}
        <div className="space-y-2">
          <Label htmlFor="furnishingStatus">Furnishing Status</Label>
          <Select value={furnishingStatus} onValueChange={(value) => setFurnishingStatus(value as FurnishingStatus)}>
            <SelectTrigger id="furnishingStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FurnishingStatus.furnished}>Furnished</SelectItem>
              <SelectItem value={FurnishingStatus.semiFurnished}>Semi-Furnished</SelectItem>
              <SelectItem value={FurnishingStatus.unfurnished}>Unfurnished</SelectItem>
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
