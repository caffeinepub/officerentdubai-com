import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Property, PropertyType, FurnishingStatus, UserProfile, UserRole, CreatePropertyParams } from '../backend';
import { ExternalBlob } from '../backend';
import { agentCodeAuth } from '../utils/agentCodeAuth';
import { useDebouncedValue } from './useDebouncedValue';
import { normalizeBackendError } from '../utils/backendError';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

/**
 * Backend autocomplete suggestions hook (fallback for when Google Places is not configured).
 * Fetches suggestions from stored properties' location and title fields.
 */
export function useBackendAutocompleteSuggestions(input: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const debouncedInput = useDebouncedValue(input, 300);

  return useQuery<string[]>({
    queryKey: ['autocomplete', 'backend', debouncedInput],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        // Pass null for maxResults to use backend default (10)
        const results = await actor.getBackendAutocompleteSuggestions(debouncedInput, null);
        return results;
      } catch (error) {
        const normalized = normalizeBackendError(error);
        console.error('Backend autocomplete error:', {
          message: normalized.message,
          input: debouncedInput,
          original: normalized.originalError,
        });
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && debouncedInput.trim().length > 0,
    retry: false,
  });
}

export function useGetAllProperties() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['properties', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProperties();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchProperties(filters: {
  location?: string;
  propertyType?: PropertyType;
  furnishingStatus?: FurnishingStatus;
  minPrice?: bigint;
  maxPrice?: bigint;
  minArea?: bigint;
  maxArea?: bigint;
}) {
  const { actor, isFetching: actorFetching } = useActor();

  // Convert bigints to strings for query key
  const queryKey = ['properties', 'search', {
    location: filters.location,
    propertyType: filters.propertyType,
    furnishingStatus: filters.furnishingStatus,
    minPrice: filters.minPrice?.toString(),
    maxPrice: filters.maxPrice?.toString(),
    minArea: filters.minArea?.toString(),
    maxArea: filters.maxArea?.toString(),
  }];

  return useQuery<Property[]>({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      
      const { location, propertyType, furnishingStatus, minPrice, maxPrice, minArea, maxArea } = filters;
      
      // If all filters are provided
      if (location && propertyType && furnishingStatus && minPrice !== undefined && maxPrice !== undefined && minArea !== undefined && maxArea !== undefined) {
        return actor.getPropertiesWithFullFilters(location, propertyType, furnishingStatus, minPrice, maxPrice, minArea, maxArea);
      }
      
      // Get all properties and apply filters client-side
      let properties = await actor.getAllProperties();
      
      // Apply location filter
      if (location) {
        properties = properties.filter(p => p.location === location);
      }
      
      // Apply property type filter
      if (propertyType) {
        properties = properties.filter(p => p.propertyType === propertyType);
      }
      
      // Apply furnishing status filter
      if (furnishingStatus) {
        properties = properties.filter(p => p.furnishingStatus === furnishingStatus);
      }
      
      // Apply price range filter
      if (minPrice !== undefined && maxPrice !== undefined) {
        properties = properties.filter(p => p.price >= minPrice && p.price <= maxPrice);
      }
      
      // Apply area range filter
      if (minArea !== undefined && maxArea !== undefined) {
        properties = properties.filter(p => p.areaSquareFeet >= minArea && p.areaSquareFeet <= maxArea);
      }
      
      return properties;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPropertyById(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Property | null>({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPropertyById(BigInt(id));
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!id,
    retry: false,
  });
}

export function useCreateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      location: string;
      propertyType: PropertyType;
      furnishingStatus: FurnishingStatus;
      areaSquareFeet: bigint;
      price: bigint;
      description: string;
      images: ExternalBlob[];
      numberOfWashrooms: bigint;
      permitNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if agent code is available
      if (!agentCodeAuth.isAuthorized()) {
        throw new Error('Authorization required. Please return to /agent and enter your agent code.');
      }

      const params: CreatePropertyParams = {
        title: data.title,
        location: data.location,
        propertyType: data.propertyType,
        furnishingStatus: data.furnishingStatus,
        areaSquareFeet: data.areaSquareFeet,
        price: data.price,
        description: data.description,
        images: data.images,
        numberOfWashrooms: data.numberOfWashrooms,
        permitNumber: data.permitNumber,
      };
      
      const agentCode = agentCodeAuth.getAgentCode();
      
      try {
        return await actor.createPropertyWithCode(params, agentCode);
      } catch (error) {
        const normalized = normalizeBackendError(error);
        console.error('Create property error:', {
          message: normalized.message,
          isAuthError: normalized.isAuthorizationError,
          original: normalized.originalError,
        });
        
        if (normalized.isAuthorizationError) {
          throw new Error('Authorization failed: Invalid agent code. Please return to /agent and enter your agent code again.');
        }
        
        throw new Error(normalized.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['autocomplete'] });
    },
  });
}

export function useUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      propertyId: bigint;
      title: string;
      location: string;
      propertyType: PropertyType;
      furnishingStatus: FurnishingStatus;
      areaSquareFeet: bigint;
      price: bigint;
      description: string;
      images: ExternalBlob[];
      numberOfWashrooms: bigint;
      permitNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if agent code is available
      if (!agentCodeAuth.isAuthorized()) {
        throw new Error('Authorization required. Please return to /agent and enter your agent code.');
      }

      const params: CreatePropertyParams = {
        title: data.title,
        location: data.location,
        propertyType: data.propertyType,
        furnishingStatus: data.furnishingStatus,
        areaSquareFeet: data.areaSquareFeet,
        price: data.price,
        description: data.description,
        images: data.images,
        numberOfWashrooms: data.numberOfWashrooms,
        permitNumber: data.permitNumber,
      };
      
      const agentCode = agentCodeAuth.getAgentCode();
      
      try {
        return await actor.updatePropertyWithCode(data.propertyId, params, agentCode);
      } catch (error) {
        const normalized = normalizeBackendError(error);
        console.error('Update property error:', {
          message: normalized.message,
          isAuthError: normalized.isAuthorizationError,
          original: normalized.originalError,
        });
        
        if (normalized.isAuthorizationError) {
          throw new Error('Authorization failed: Invalid agent code. Please return to /agent and enter your agent code again.');
        }
        
        throw new Error(normalized.message);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.propertyId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['autocomplete'] });
    },
  });
}

export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if agent code is available
      if (!agentCodeAuth.isAuthorized()) {
        throw new Error('Authorization required. Please return to /agent and enter your agent code.');
      }

      const agentCode = agentCodeAuth.getAgentCode();
      
      try {
        return await actor.deletePropertyWithCode(propertyId, agentCode);
      } catch (error) {
        const normalized = normalizeBackendError(error);
        console.error('Delete property error:', {
          message: normalized.message,
          isAuthError: normalized.isAuthorizationError,
          original: normalized.originalError,
          propertyId: propertyId.toString(),
        });
        
        if (normalized.isAuthorizationError) {
          throw new Error('Authorization failed: Invalid agent code. Please return to /agent and enter your agent code again.');
        }
        
        throw new Error(normalized.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['autocomplete'] });
    },
  });
}
