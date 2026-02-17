// Backend Error Normalization Utility
// Extracts and normalizes error messages from backend calls

export interface NormalizedError {
  message: string;
  isAuthorizationError: boolean;
  originalError: unknown;
}

export function normalizeBackendError(error: unknown): NormalizedError {
  let message = 'An unexpected error occurred';
  let isAuthorizationError = false;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as any).message);
  }

  // Check if the error message indicates authorization failure
  const authKeywords = [
    'unauthorized',
    'invalid agent code',
    'agent code',
    'authorization required',
    'access denied',
  ];

  const lowerMessage = message.toLowerCase();
  isAuthorizationError = authKeywords.some(keyword => lowerMessage.includes(keyword));

  return {
    message,
    isAuthorizationError,
    originalError: error,
  };
}
