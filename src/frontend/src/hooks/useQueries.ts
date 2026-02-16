import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Property, PropertyType, UserProfile, UserRole, CreatePropertyParams } from '../backend';
import { ExternalBlob } from '../backend';
import { agentCodeAuth } from '../utils/agentCodeAuth';

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

export function useSearchProperties(filters: {
  location?: string;
  propertyType?: PropertyType;
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
    minPrice: filters.minPrice?.toString(),
    maxPrice: filters.maxPrice?.toString(),
    minArea: filters.minArea?.toString(),
    maxArea: filters.maxArea?.toString(),
  }];

  return useQuery<Property[]>({
    queryKey,
    queryFn: async () => {
      if (!actor) return [];
      
      const { location, propertyType, minPrice, maxPrice, minArea, maxArea } = filters;
      
      // If all filters are provided
      if (location && propertyType && minPrice !== undefined && maxPrice !== undefined && minArea !== undefined && maxArea !== undefined) {
        return actor.getPropertiesByAllFilters(location, propertyType, minPrice, maxPrice, minArea, maxArea);
      }
      
      // If location and type
      if (location && propertyType) {
        return actor.getPropertiesByLocationAndType(location, propertyType);
      }
      
      // If only location
      if (location) {
        return actor.getPropertiesByLocation(location);
      }
      
      // If only type
      if (propertyType) {
        return actor.getPropertiesByType(propertyType);
      }
      
      // If only price range
      if (minPrice !== undefined && maxPrice !== undefined) {
        return actor.getPropertiesByPriceRange(minPrice, maxPrice);
      }
      
      // If only area range
      if (minArea !== undefined && maxArea !== undefined) {
        return actor.getPropertiesByAreaRange(minArea, maxArea);
      }
      
      // Default: get all
      return actor.getAllProperties();
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
      areaSquareFeet: bigint;
      price: bigint;
      description: string;
      images: ExternalBlob[];
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
        areaSquareFeet: data.areaSquareFeet,
        price: data.price,
        description: data.description,
        images: data.images,
      };
      
      return actor.createProperty(params, agentCodeAuth.getAgentCode());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
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
      areaSquareFeet: bigint;
      price: bigint;
      description: string;
      images: ExternalBlob[];
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
        areaSquareFeet: data.areaSquareFeet,
        price: data.price,
        description: data.description,
        images: data.images,
      };
      
      return actor.updateProperty(data.propertyId, params, agentCodeAuth.getAgentCode());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property'] });
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
      
      return actor.deleteProperty(propertyId, agentCodeAuth.getAgentCode());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
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
