import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
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
    error: suggestionsError,
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

  // Show suggestions when there are results or show loading/error states
  useEffect(() => {
    if (location.trim().length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions, location, suggestionsLoading, suggestionsError]);

  // Determine what to show in the dropdown
  const shouldShowDropdown = showSuggestions && location.trim().length > 0;
  const hasNoResults = !suggestionsLoading && !suggestionsError && suggestions.length === 0 && location.trim().length > 0;

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
              if (location.trim().length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="w-full"
          />
          
          {/* Autocomplete Dropdown */}
          {shouldShowDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
            >
              {suggestionsLoading && (
                <div className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading suggestions...
                </div>
              )}
              
              {suggestionsError && (
                <div className="px-4 py-3 text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Could not load suggestions
                </div>
              )}
              
              {hasNoResults && (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No matching locations found
                </div>
              )}
              
              {!suggestionsLoading && !suggestionsError && suggestions.length > 0 && (
                <>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
                        index === highlightedIndex ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Helper text */}
          {location.trim().length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Suggestions from listed properties
            </p>
          )}
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select
            value={propertyType}
            onValueChange={(value) => setPropertyType(value as PropertyType)}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Furnishing Status */}
        <div className="space-y-2">
          <Label htmlFor="furnishingStatus">Furnishing Status</Label>
          <Select
            value={furnishingStatus}
            onValueChange={(value) => setFurnishingStatus(value as FurnishingStatus)}
          >
            <SelectTrigger id="furnishingStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="furnished">Furnished</SelectItem>
              <SelectItem value="semiFurnished">Semi-Furnished</SelectItem>
              <SelectItem value="unfurnished">Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Area */}
        <div className="space-y-2">
          <Label htmlFor="minArea">Min Area (sq ft)</Label>
          <Input
            id="minArea"
            type="number"
            placeholder="e.g., 500"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
          />
        </div>

        {/* Max Area */}
        <div className="space-y-2">
          <Label htmlFor="maxArea">Max Area (sq ft)</Label>
          <Input
            id="maxArea"
            type="number"
            placeholder="e.g., 2000"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
          />
        </div>

        {/* Min Price */}
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price (AED)</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="e.g., 50000"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Max Price */}
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price (AED)</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="e.g., 200000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <Button onClick={handleSearch} size="lg" className="min-w-[200px]">
          <Search className="mr-2 h-5 w-5" />
          Search Properties
        </Button>
      </div>
    </div>
  );
}
