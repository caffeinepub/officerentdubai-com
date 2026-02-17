// Backend Error Normalization Utility
// Extracts and normalizes error messages from backend calls

export interface NormalizedError {
  message: string;
  isAuthorizationError: boolean;
  originalError: unknown;
}

/**
 * Normalizes backend errors to extract clean, readable English messages.
 * Handles common canister error wrappers like "Call was rejected:" and "Canister trapped:".
 */
export function normalizeBackendError(error: unknown): NormalizedError {
  let message = 'An unexpected error occurred';
  let isAuthorizationError = false;

  // Extract the raw message
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as any).message);
  }

  // Clean up common canister error prefixes to get the actual trap message
  const prefixPatterns = [
    /^Call was rejected:\s*/i,
    /^Canister trapped:\s*/i,
    /^Reject text:\s*/i,
    /^IC0503:\s*/i,
    /^Request ID:\s*[a-f0-9]+\s*/i,
  ];

  for (const pattern of prefixPatterns) {
    message = message.replace(pattern, '');
  }

  // Trim whitespace and quotes
  message = message.trim().replace(/^["']|["']$/g, '');

  // Check if the error message indicates authorization failure
  const authKeywords = [
    'unauthorized',
    'invalid agent code',
    'agent code',
    'authorization required',
    'access denied',
    'only agents can',
  ];

  const lowerMessage = message.toLowerCase();
  isAuthorizationError = authKeywords.some(keyword => lowerMessage.includes(keyword));

  return {
    message,
    isAuthorizationError,
    originalError: error,
  };
}
