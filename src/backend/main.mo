import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iterator "mo:core/Iter";

actor {
  type StockItem = {
    name : Text;
    description : Text;
    quantity : Nat;
    lastUpdated : Time.Time;
  };

  let stockItems = Map.empty<Text, StockItem>();

  public shared ({ caller }) func addStockItem(name : Text, description : Text, quantity : Nat) : async () {
    let item : StockItem = {
      name;
      description;
      quantity;
      lastUpdated = Time.now();
    };
    stockItems.add(name, item);
  };

  public shared ({ caller }) func updateStockItem(name : Text, newQuantity : Nat) : async () {
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
    if (not stockItems.containsKey(name)) {
      Runtime.trap("Item does not exist");
    };
    stockItems.remove(name);
  };

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
