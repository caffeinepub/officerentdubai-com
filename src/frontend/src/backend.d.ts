import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Property {
    id: bigint;
    title: string;
    furnishingStatus: FurnishingStatus;
    propertyType: PropertyType;
    permitNumber: string;
    description: string;
    price: bigint;
    areaSquareFeet: bigint;
    location: string;
    numberOfWashrooms: bigint;
    images: Array<ExternalBlob>;
}
export interface CreatePropertyParams {
    title: string;
    furnishingStatus: FurnishingStatus;
    propertyType: PropertyType;
    permitNumber: string;
    description: string;
    price: bigint;
    areaSquareFeet: bigint;
    location: string;
    numberOfWashrooms: bigint;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
}
export enum FurnishingStatus {
    semiFurnished = "semiFurnished",
    furnished = "furnished",
    unfurnished = "unfurnished"
}
export enum PropertyType {
    retail = "retail",
    office = "office"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPropertyWithCode(params: CreatePropertyParams, agentCode: string): Promise<void>;
    deletePropertyWithCode(propertyId: bigint, agentCode: string): Promise<void>;
    getAllProperties(): Promise<Array<Property>>;
    getBackendAutocompleteSuggestions(input: string, maxResults: bigint | null): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPropertiesByAreaRange(minArea: bigint, maxArea: bigint): Promise<Array<Property>>;
    getPropertiesByFurnishingStatus(status: FurnishingStatus): Promise<Array<Property>>;
    getPropertiesByLocation(location: string): Promise<Array<Property>>;
    getPropertiesByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Property>>;
    getPropertiesByType(propType: PropertyType): Promise<Array<Property>>;
    getPropertiesWithFullFilters(location: string, propType: PropertyType, furnishingStatus: FurnishingStatus, minPrice: bigint, maxPrice: bigint, minArea: bigint, maxArea: bigint): Promise<Array<Property>>;
    getPropertyById(propertyId: bigint): Promise<Property>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePropertyWithCode(propertyId: bigint, params: CreatePropertyParams, agentCode: string): Promise<void>;
}
