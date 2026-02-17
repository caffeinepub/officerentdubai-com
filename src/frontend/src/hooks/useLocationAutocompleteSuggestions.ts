/**
 * Orchestration hook that combines Google Places and backend autocomplete.
 * Prefers Google Places when configured, falls back to backend suggestions.
 */

import { useGooglePlacesAutocomplete } from './useGooglePlacesAutocomplete';
import { useBackendAutocompleteSuggestions } from './useQueries';

interface LocationSuggestionsResult {
  suggestions: string[];
  isLoading: boolean;
  source: 'google' | 'backend' | 'none';
  isGoogleConfigured: boolean;
}

/**
 * Hook that provides location autocomplete suggestions from the best available source.
 * Prefers Google Places (when configured), falls back to backend suggestions.
 * @param input - The search input string
 * @returns Combined autocomplete suggestions and metadata
 */
export function useLocationAutocompleteSuggestions(input: string): LocationSuggestionsResult {
  const {
    suggestions: googleSuggestions,
    isLoading: googleLoading,
    isConfigured: googleConfigured,
    isReady: googleReady,
    error: googleError,
  } = useGooglePlacesAutocomplete(input, true);

  const {
    data: backendSuggestions = [],
    isLoading: backendLoading,
  } = useBackendAutocompleteSuggestions(input);

  // Determine which source to use
  let source: 'google' | 'backend' | 'none' = 'none';
  let suggestions: string[] = [];
  let isLoading = false;

  if (googleConfigured && googleReady && !googleError) {
    // Use Google suggestions when available and healthy
    source = 'google';
    suggestions = googleSuggestions;
    isLoading = googleLoading;
  } else if (backendSuggestions.length > 0 || backendLoading) {
    // Fall back to backend suggestions
    source = 'backend';
    suggestions = backendSuggestions;
    isLoading = backendLoading;
  }

  return {
    suggestions,
    isLoading,
    source,
    isGoogleConfigured: googleConfigured,
  };
}
