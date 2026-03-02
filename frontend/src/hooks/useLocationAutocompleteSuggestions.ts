/**
 * Hook that provides location autocomplete suggestions from backend stored properties only.
 * Searches property location fields for matches (does not search titles).
 */

import { useBackendAutocompleteSuggestions } from './useQueries';
import type { LocationSuggestion } from '../backend';

interface LocationSuggestionsResult {
  suggestions: LocationSuggestion[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook that provides location-only autocomplete suggestions from backend stored properties.
 * @param input - The search input string
 * @returns Location autocomplete suggestions with area information and metadata
 */
export function useLocationAutocompleteSuggestions(input: string): LocationSuggestionsResult {
  const {
    data: backendSuggestions = [],
    isLoading: backendLoading,
    error: backendError,
  } = useBackendAutocompleteSuggestions(input);

  // Backend returns LocationSuggestion objects with location and area fields
  return {
    suggestions: backendSuggestions,
    isLoading: backendLoading,
    error: backendError instanceof Error ? backendError.message : backendError ? 'Failed to load suggestions' : null,
  };
}
