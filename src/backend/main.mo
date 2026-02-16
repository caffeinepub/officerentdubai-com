import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  type PropertyType = {
    #office;
    #retail;
  };

  var nextId = 0;

  type Property = {
    id : Nat;
    title : Text;
    location : Text;
    propertyType : PropertyType;
    areaSquareFeet : Nat;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
  };

  type CreatePropertyParams = {
    title : Text;
    location : Text;
    propertyType : PropertyType;
    areaSquareFeet : Nat;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
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

  // Commercial Agent Code (Guard for sensitive list management functions)
  let agentCode = "050702";

  // User Profile Management
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

  // Property Query Functions (Public - No Agent Code Required)
  public query ({ caller }) func getAllProperties() : async [Property] {
    properties.values().toArray();
  };

  public query ({ caller }) func getPropertiesByLocation(location : Text) : async [Property] {
    properties.values().toArray().filter(
      func(p) { Text.compare(p.location, location) == #equal }
    );
  };

  public query ({ caller }) func getPropertiesByType(propType : PropertyType) : async [Property] {
    properties.values().toArray().filter(
      func(p) { p.propertyType == propType }
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

  public query ({ caller }) func getPropertiesByLocationAndType(location : Text, propType : PropertyType) : async [Property] {
    properties.values().toArray().filter(
      func(p) {
        Text.compare(p.location, location) == #equal and p.propertyType == propType
      }
    );
  };

  public query ({ caller }) func getPropertiesByAllFilters(
    location : Text,
    propType : PropertyType,
    minPrice : Nat,
    maxPrice : Nat,
    minArea : Nat,
    maxArea : Nat,
  ) : async [Property] {
    properties.values().toArray().filter(
      func(p) {
        Text.compare(p.location, location) == #equal and
        p.propertyType == propType and
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

  // Property Management Functions (Require Agent Code)
  public shared ({ caller }) func createProperty(params : CreatePropertyParams, providedAgentCode : Text) : async () {
    if (providedAgentCode != agentCode) {
      Runtime.trap("Unauthorized: Only commercial agents can manage properties. Please contact the system's owner for access.");
    };
    let propertyId = nextId;
    nextId += 1;

    let property : Property = {
      id = propertyId;
      title = params.title;
      location = params.location;
      propertyType = params.propertyType;
      areaSquareFeet = params.areaSquareFeet;
      price = params.price;
      description = params.description;
      images = params.images;
    };

    properties.add(propertyId, property);
  };

  public shared ({ caller }) func updateProperty(propertyId : Nat, params : CreatePropertyParams, providedAgentCode : Text) : async () {
    if (providedAgentCode != agentCode) {
      Runtime.trap("Unauthorized: Only commercial agents can manage properties. Please contact the system's owner for access.");
    };
    switch (properties.get(propertyId)) {
      case (null) { Runtime.trap("Property not found") };
      case (?_) {
        properties.add(propertyId, {
          id = propertyId;
          title = params.title;
          location = params.location;
          propertyType = params.propertyType;
          areaSquareFeet = params.areaSquareFeet;
          price = params.price;
          description = params.description;
          images = params.images;
        });
      };
    };
  };

  public shared ({ caller }) func deleteProperty(propertyId : Nat, providedAgentCode : Text) : async () {
    if (providedAgentCode != agentCode) {
      Runtime.trap("Unauthorized: Only commercial agents can manage properties. Please contact the system's owner for access.");
    };
    switch (properties.get(propertyId)) {
      case (null) { Runtime.trap("Property not found") };
      case (?_) {
        properties.remove(propertyId);
      };
    };
  };
};
