import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iterator "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Stock Management Types and State
  type StockItem = {
    name : Text;
    description : Text;
    quantity : Nat;
    lastUpdated : Time.Time;
  };

  let stockItems = Map.empty<Text, StockItem>();

  // Stock Management Functions - Write Operations (require user role)
  public shared ({ caller }) func addStockItem(name : Text, description : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add stock items");
    };
    let item : StockItem = {
      name;
      description;
      quantity;
      lastUpdated = Time.now();
    };
    stockItems.add(name, item);
  };

  public shared ({ caller }) func updateStockItem(name : Text, newQuantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update stock items");
    };
    switch (stockItems.get(name)) {
      case (null) { Runtime.trap("Item does not exist") };
      case (?item) {
        let updatedItem : StockItem = {
          name = item.name;
          description = item.description;
          quantity = newQuantity;
          lastUpdated = Time.now();
        };
        stockItems.add(name, updatedItem);
      };
    };
  };

  public shared ({ caller }) func removeStockItem(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove stock items");
    };
    if (not stockItems.containsKey(name)) {
      Runtime.trap("Item does not exist");
    };
    stockItems.remove(name);
  };

  // Stock Management Functions - Read Operations (available to all including guests)
  public query ({ caller }) func getStockItem(name : Text) : async StockItem {
    switch (stockItems.get(name)) {
      case (null) { Runtime.trap("Item does not exist") };
      case (?item) { item };
    };
  };

  public query ({ caller }) func getAllStockItems() : async [StockItem] {
    stockItems.values().toArray();
  };
};
