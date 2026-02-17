/**
 * Centralized frontend configuration for public build-time environment variables.
 * Reads from import.meta.env without hardcoding secrets in the repository.
 */

export const publicEnv = {
  /**
   * Google Places API key for location autocomplete.
   * Set via VITE_GOOGLE_PLACES_API_KEY environment variable at build time.
   */
  googlePlacesApiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined,
};
