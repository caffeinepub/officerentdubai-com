/**
 * Hook that provides location autocomplete suggestions from backend stored properties only.
 * Searches property location fields for matches (does not search titles).
 */

import { useBackendAutocompleteSuggestions } from './useQueries';

interface LocationSuggestionsResult {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook that provides location-only autocomplete suggestions from backend stored properties.
 * @param input - The search input string
 * @returns Location-only autocomplete suggestions and metadata
 */
export function useLocationAutocompleteSuggestions(input: string): LocationSuggestionsResult {
  const {
    data: backendSuggestions = [],
    isLoading: backendLoading,
    error: backendError,
  } = useBackendAutocompleteSuggestions(input);

  // Backend already returns location-only suggestions, de-duplicated and limited
  return {
    suggestions: backendSuggestions,
    isLoading: backendLoading,
    error: backendError instanceof Error ? backendError.message : backendError ? 'Failed to load suggestions' : null,
  };
}
