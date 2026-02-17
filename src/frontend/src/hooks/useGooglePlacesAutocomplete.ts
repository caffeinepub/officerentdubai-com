/**
 * React hook for Google Places Autocomplete with UAE restriction and Dubai bias.
 * Returns location suggestions based on user input with proper debouncing.
 */

import { useState, useEffect, useRef } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { loadGooglePlacesAPI, isGooglePlacesLoaded } from '../utils/googlePlacesLoader';
import { publicEnv } from '../config/publicEnv';

interface GooglePlacesAutocompleteResult {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  isReady: boolean;
}

/**
 * Hook to fetch Google Places autocomplete suggestions with UAE restriction and Dubai bias.
 * @param input - The search input string
 * @param enabled - Whether to fetch suggestions (default: true)
 * @returns Autocomplete suggestions and status
 */
export function useGooglePlacesAutocomplete(
  input: string,
  enabled: boolean = true
): GooglePlacesAutocompleteResult {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const debouncedInput = useDebouncedValue(input, 300);
  const serviceRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);

  const isConfigured = !!publicEnv.googlePlacesApiKey;

  // Initialize Google Places API
  useEffect(() => {
    if (!isConfigured || !enabled) {
      return;
    }

    let mounted = true;

    const initAPI = async () => {
      try {
        await loadGooglePlacesAPI();
        
        if (!mounted) return;

        if (isGooglePlacesLoaded() && window.google?.maps?.places) {
          serviceRef.current = new window.google.maps.places.AutocompleteService();
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
          setIsReady(true);
          setError(null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Failed to load Google Places API:', err);
        setError('Failed to load Google Places API');
        setIsReady(false);
      }
    };

    initAPI();

    return () => {
      mounted = false;
    };
  }, [isConfigured, enabled]);

  // Fetch suggestions when input changes
  useEffect(() => {
    if (!isReady || !serviceRef.current || !enabled || !window.google?.maps) {
      setSuggestions([]);
      return;
    }

    const trimmedInput = debouncedInput.trim();
    
    if (trimmedInput.length === 0) {
      setSuggestions([]);
      return;
    }

    let mounted = true;
    setIsLoading(true);
    setError(null);

    // Create Dubai location for bias
    const dubaiLocation = new window.google.maps.LatLng(25.2048, 55.2708);

    const request = {
      input: trimmedInput,
      sessionToken: sessionTokenRef.current,
      componentRestrictions: { country: 'ae' }, // Restrict to UAE
      location: dubaiLocation, // Dubai coordinates
      radius: 50000, // 50km radius around Dubai for bias
    };

    serviceRef.current.getPlacePredictions(
      request,
      (predictions: any[], status: string) => {
        if (!mounted) return;

        setIsLoading(false);

        // Safe access to PlacesServiceStatus
        const placesStatus = window.google?.maps?.places?.PlacesServiceStatus;
        
        if (!placesStatus) {
          console.error('PlacesServiceStatus not available');
          setSuggestions([]);
          setError('Google Places API not properly loaded');
          return;
        }

        if (status === placesStatus.OK && predictions) {
          const suggestionTexts = predictions.map((p: any) => p.description);
          setSuggestions(suggestionTexts);
          setError(null);
        } else if (status === placesStatus.ZERO_RESULTS) {
          setSuggestions([]);
          setError(null);
        } else {
          console.error('Google Places API error:', status);
          setSuggestions([]);
          setError('Failed to fetch suggestions');
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [debouncedInput, isReady, enabled]);

  return {
    suggestions,
    isLoading,
    error,
    isConfigured,
    isReady,
  };
}
