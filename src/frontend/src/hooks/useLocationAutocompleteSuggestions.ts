/**
 * Hook that provides location autocomplete suggestions from backend stored properties only.
 * Searches property location and title fields for matches.
 */

import { useBackendAutocompleteSuggestions } from './useQueries';

interface LocationSuggestionsResult {
  suggestions: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook that provides location autocomplete suggestions from backend stored properties.
 * @param input - The search input string
 * @returns Backend autocomplete suggestions and metadata
 */
export function useLocationAutocompleteSuggestions(input: string): LocationSuggestionsResult {
  const {
    data: backendSuggestions = [],
    isLoading: backendLoading,
    error: backendError,
  } = useBackendAutocompleteSuggestions(input);

  return {
    suggestions: backendSuggestions,
    isLoading: backendLoading,
    error: backendError instanceof Error ? backendError.message : backendError ? 'Failed to load suggestions' : null,
  };
}
