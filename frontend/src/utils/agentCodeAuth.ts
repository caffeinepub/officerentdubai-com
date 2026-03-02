// Agent Code Authentication Utility
// Manages local authorization state for Agent Arena access and provides the agent code for backend mutations

const STORAGE_KEY = 'agent_code_authorized';
const AGENT_CODE = '050702';

export const agentCodeAuth = {
  // Check if the user is currently authorized
  isAuthorized(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  },

  // Verify the provided code and set authorization if correct
  authorize(code: string): boolean {
    if (code === AGENT_CODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  },

  // Clear authorization (logout)
  clearAuthorization(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get the agent code for backend calls (returns the correct code when authorized)
  getAgentCode(): string {
    return AGENT_CODE;
  },
};
