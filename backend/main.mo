import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var nextId = 0;

  type Area = {
    name : Text;
    description : Text;
  };

  type PropertyType = {
    #office;
    #retail;
  };

  type FurnishingStatus = {
    #furnished;
    #semiFurnished;
    #unfurnished;
  };

  type Property = {
    id : Nat;
    title : Text;
    location : Text; // Format: "<buildingName>, <areaName>"
    areaName : Text; // Only the area, e.g. Dubai World Trade Center
    propertyType : PropertyType;
    furnishingStatus : FurnishingStatus;
    areaSquareFeet : Nat;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
    numberOfWashrooms : Nat;
    permitNumber : Text;
  };

  type CreatePropertyParams = {
    title : Text;
    location : Text; // Format: "<buildingName>, <areaName>"
    areaName : Text;
    propertyType : PropertyType;
    furnishingStatus : FurnishingStatus;
    areaSquareFeet : Nat;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
    numberOfWashrooms : Nat;
    permitNumber : Text;
  };

  type LocationSuggestion = {
    location : Text;
    area : Text;
  };

  module Property {
    public func compareByPrice(p1 : Property, p2 : Property) : Order.Order {
      Nat.compare(p1.price, p2.price);
    };

    public func compareByArea(p1 : Property, p2 : Property) : Order.Order {
      Nat.compare(p1.areaSquareFeet, p2.areaSquareFeet);
    };
  };

  let properties = Map.empty<Nat, Property>();
  let areas = Map.empty<Text, Area>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Query Functions - Public access for property browsing (guests can view)
  public query ({ caller }) func getAllProperties() : async [Property] {
    properties.values().toArray();
  };

  public query ({ caller }) func getPropertiesByLocation(location : Text) : async [Property] {
    properties.values().toArray().filter(
      func(p) { Text.compare(p.location, location) == #equal }
    );
  };

  public query ({ caller }) func getPropertiesByArea(area : Text) : async [Property] {
    properties.values().toArray().filter(
      func(p) { Text.compare(p.areaName, area) == #equal }
    );
  };

  public query ({ caller }) func getPropertiesByType(propType : PropertyType) : async [Property] {
    properties.values().toArray().filter(
      func(p) { p.propertyType == propType }
    );
  };

  public query ({ caller }) func getPropertiesByFurnishingStatus(status : FurnishingStatus) : async [Property] {
    properties.values().toArray().filter(
      func(p) { p.furnishingStatus == status }
    );
  };

  public query ({ caller }) func getPropertiesByPriceRange(minPrice : Nat, maxPrice : Nat) : async [Property] {
    properties.values().toArray().filter(
      func(p) { p.price >= minPrice and p.price <= maxPrice }
    );
  };

  public query ({ caller }) func getPropertiesByAreaRange(minArea : Nat, maxArea : Nat) : async [Property] {
    properties.values().toArray().filter(
      func(p) { p.areaSquareFeet >= minArea and p.areaSquareFeet <= maxArea }
    );
  };

  public query ({ caller }) func getPropertiesWithFullFilters(
    location : Text,
    propType : PropertyType,
    furnishingStatus : FurnishingStatus,
    minPrice : Nat,
    maxPrice : Nat,
    minArea : Nat,
    maxArea : Nat,
  ) : async [Property] {
    properties.values().toArray().filter(
      func(p) {
        Text.compare(p.location, location) == #equal and
        p.propertyType == propType and
        p.furnishingStatus == furnishingStatus and
        p.price >= minPrice and p.price <= maxPrice and
        p.areaSquareFeet >= minArea and p.areaSquareFeet <= maxArea
      }
    );
  };

  public query ({ caller }) func getPropertyById(propertyId : Nat) : async Property {
    switch (properties.get(propertyId)) {
      case (null) { Runtime.trap("Property not found") };
      case (?property) { property };
    };
  };

  // Create Property - Admin only (agents should be assigned admin role)
  public shared ({ caller }) func createPropertyWithCode(params : CreatePropertyParams, agentCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create properties");
    };

    let propertyId = nextId;
    nextId += 1;
    let property : Property = {
      id = propertyId;
      title = params.title;
      location = params.location;
      areaName = params.areaName;
      propertyType = params.propertyType;
      furnishingStatus = params.furnishingStatus;
      areaSquareFeet = params.areaSquareFeet;
      price = params.price;
      description = params.description;
      images = params.images;
      numberOfWashrooms = params.numberOfWashrooms;
      permitNumber = params.permitNumber;
    };

    properties.add(propertyId, property);
  };

  // Update Property - Admin only (agents should be assigned admin role)
  public shared ({ caller }) func updatePropertyWithCode(propertyId : Nat, params : CreatePropertyParams, agentCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update properties");
    };

    switch (properties.get(propertyId)) {
      case (null) { Runtime.trap("Property not found") };
      case (?_) {
        let updatedProperty : Property = {
          id = propertyId;
          title = params.title;
          location = params.location;
          areaName = params.areaName;
          propertyType = params.propertyType;
          furnishingStatus = params.furnishingStatus;
          areaSquareFeet = params.areaSquareFeet;
          price = params.price;
          description = params.description;
          images = params.images;
          numberOfWashrooms = params.numberOfWashrooms;
          permitNumber = params.permitNumber;
        };
        properties.add(propertyId, updatedProperty);
      };
    };
  };

  // Delete Property - Admin only (agents should be assigned admin role)
  public shared ({ caller }) func deletePropertyWithCode(propertyId : Nat, agentCode : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete properties");
    };

    switch (properties.get(propertyId)) {
      case (null) { Runtime.trap("Property not found") };
      case (?_) {
        properties.remove(propertyId);
      };
    };
  };

  /// AUTOCOMPLETE & SEARCH FUNCTIONALITY

  // Returns property suggestions for a given input, ordered by relevance.
  // Public access - guests can use autocomplete
  public query ({ caller }) func getLocationSuggestions(input : Text, maxResults : ?Nat) : async [LocationSuggestion] {
    let lowercaseInput = input.toLower();
    let max = switch (maxResults) {
      case (?value) { value };
      case (null) { 10 };
    };

    let filtered = properties.values().filter(
      func(p) { p.location.toLower().contains(#text lowercaseInput) }
    );

    // Limit results to max count
    let limited = filtered.take(max);
    let locations = limited.map(func(p) { { location = p.location; area = p.areaName } });
    locations.toArray();
  };

  // Returns a list of properties that match the location search term (partial match)
  // Public access - guests can search
  public query ({ caller }) func searchPropertiesByLocation(searchTerm : Text) : async [Property] {
    let lowercaseTerm = searchTerm.toLower();
    properties.values().toArray().filter(
      func(p) { p.location.toLower().contains(#text lowercaseTerm) }
    );
  };
};
