import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldProperty = {
    id : Nat;
    title : Text;
    location : Text;
    propertyType : {
      #office;
      #retail;
    };
    areaSquareFeet : Nat;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
  };

  type OldActor = {
    nextId : Nat;
    properties : Map.Map<Nat, OldProperty>;
    userProfiles : Map.Map<Principal, { name : Text }>;

    // Dropped agentCode field for compatibility
    agentCode : Text;
  };

  type NewProperty = {
    id : Nat;
    title : Text;
    location : Text;
    propertyType : {
      #office;
      #retail;
    };
    furnishingStatus : {
      #furnished;
      #semiFurnished;
      #unfurnished;
    };
    areaSquareFeet : Nat;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
    numberOfWashrooms : Nat;
    permitNumber : Text;
  };

  type NewActor = {
    nextId : Nat;
    properties : Map.Map<Nat, NewProperty>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    let newProperties = old.properties.map<Nat, OldProperty, NewProperty>(
      func(_id, oldProperty) {
        {
          oldProperty with
          furnishingStatus = #unfurnished;
          numberOfWashrooms = 0;
          permitNumber = "";
        };
      }
    );
    {
      old with
      properties = newProperties;
      // Intentionally dropping agentCode here (access control now elsewhere)
    };
  };
};
