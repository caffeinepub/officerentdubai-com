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
    locationSearchTerm?: string;
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
  const [propertyType, setPropertyType] = useState<PropertyType | 'all'>('all');
  const [furnishingStatus, setFurnishingStatus] = useState<FurnishingStatus | 'all'>('all');
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
      locationSearchTerm?: string;
      propertyType?: PropertyType;
      furnishingStatus?: FurnishingStatus;
      minPrice?: bigint;
      maxPrice?: bigint;
      minArea?: bigint;
      maxArea?: bigint;
    } = {};

    if (location.trim()) filters.locationSearchTerm = location.trim();
    if (propertyType !== 'all') filters.propertyType = propertyType as PropertyType;
    if (furnishingStatus !== 'all') filters.furnishingStatus = furnishingStatus as FurnishingStatus;
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
        } else {
          handleSearch();
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
          <Label htmlFor="location" className="text-foreground">Location</Label>
          <Input
            ref={inputRef}
            id="location"
            placeholder="e.g., Business Bay"
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
                <div className="px-4 py-3 text-sm text-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                  Loading suggestions...
                </div>
              )}
              
              {suggestionsError && (
                <div className="px-4 py-3 text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  Could not load suggestions
                </div>
              )}
              
              {hasNoResults && (
                <div className="px-4 py-3 text-sm text-foreground">
                  No matching locations found
                </div>
              )}
              
              {!suggestionsLoading && !suggestionsError && suggestions.length > 0 && (
                <>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors ${
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
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="propertyType" className="text-foreground">Property Type</Label>
          <Select value={propertyType} onValueChange={(value) => setPropertyType(value as PropertyType | 'all')}>
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
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
          <Label htmlFor="furnishingStatus" className="text-foreground">Furnishing</Label>
          <Select value={furnishingStatus} onValueChange={(value) => setFurnishingStatus(value as FurnishingStatus | 'all')}>
            <SelectTrigger id="furnishingStatus">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={FurnishingStatus.furnished}>Furnished</SelectItem>
              <SelectItem value={FurnishingStatus.semiFurnished}>Semi-Furnished</SelectItem>
              <SelectItem value={FurnishingStatus.unfurnished}>Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Area Range */}
        <div className="space-y-2">
          <Label className="text-foreground">Area (SQFT)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label className="text-foreground">Price (AED)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full" size="lg">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
