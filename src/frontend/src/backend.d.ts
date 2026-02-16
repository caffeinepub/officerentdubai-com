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
    propertyType: PropertyType;
    description: string;
    price: bigint;
    areaSquareFeet: bigint;
    location: string;
    images: Array<ExternalBlob>;
}
export interface CreatePropertyParams {
    title: string;
    propertyType: PropertyType;
    description: string;
    price: bigint;
    areaSquareFeet: bigint;
    location: string;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
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
    createProperty(params: CreatePropertyParams, providedAgentCode: string): Promise<void>;
    deleteProperty(propertyId: bigint, providedAgentCode: string): Promise<void>;
    getAllProperties(): Promise<Array<Property>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPropertiesByAllFilters(location: string, propType: PropertyType, minPrice: bigint, maxPrice: bigint, minArea: bigint, maxArea: bigint): Promise<Array<Property>>;
    getPropertiesByAreaRange(minArea: bigint, maxArea: bigint): Promise<Array<Property>>;
    getPropertiesByLocation(location: string): Promise<Array<Property>>;
    getPropertiesByLocationAndType(location: string, propType: PropertyType): Promise<Array<Property>>;
    getPropertiesByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Property>>;
    getPropertiesByType(propType: PropertyType): Promise<Array<Property>>;
    getPropertyById(propertyId: bigint): Promise<Property>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProperty(propertyId: bigint, params: CreatePropertyParams, providedAgentCode: string): Promise<void>;
}
