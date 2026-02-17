/**
 * Google Maps JavaScript API loader with Places library support.
 * Loads the script once and provides readiness state for safe usage.
 */

import { publicEnv } from '../config/publicEnv';

let loadPromise: Promise<void> | null = null;
let isLoaded = false;
let loadError: Error | null = null;

/**
 * Load the Google Maps JavaScript API with Places library.
 * Safe to call multiple times - will only load once.
 * @returns Promise that resolves when the API is ready or rejects on error
 */
export async function loadGooglePlacesAPI(): Promise<void> {
  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Return immediately if already loaded
  if (isLoaded) {
    return Promise.resolve();
  }

  // Return error if previous load failed
  if (loadError) {
    return Promise.reject(loadError);
  }

  // Check if API key is configured
  const apiKey = publicEnv.googlePlacesApiKey;
  if (!apiKey) {
    loadError = new Error('Google Places API key not configured');
    return Promise.reject(loadError);
  }

  // Check if already loaded by another script
  if (window.google?.maps?.places) {
    isLoaded = true;
    return Promise.resolve();
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.maps?.places) {
        isLoaded = true;
        resolve();
      } else {
        loadError = new Error('Google Places library failed to load');
        reject(loadError);
      }
    };

    script.onerror = () => {
      loadError = new Error('Failed to load Google Maps script');
      reject(loadError);
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

/**
 * Check if Google Places API is currently loaded and ready
 */
export function isGooglePlacesLoaded(): boolean {
  return isLoaded && !!window.google?.maps?.places;
}

/**
 * Get the current load error if any
 */
export function getLoadError(): Error | null {
  return loadError;
}

// Extend window type for TypeScript with complete Google Maps types
declare global {
  interface Window {
    google?: {
      maps?: {
        LatLng: new (lat: number, lng: number) => any;
        places?: {
          AutocompleteService: new () => any;
          AutocompleteSessionToken: new () => any;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            INVALID_REQUEST: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            UNKNOWN_ERROR: string;
          };
        };
      };
    };
  }
}
