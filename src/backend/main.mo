import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

persistent actor SimpleGame {
    
    // Simple types
    public type GameState = {
        location: Text;
        inventory: [Text];
        level: Nat;
        xp: Nat;
        credits: Nat;
        commandCount: Nat;
        visitedRooms: Nat;
        achievements: [Text];
        gameCompleted: Bool;
    };
    
    public type GameResponse = {
        message: Text;
        gameState: GameState;
        newAchievements: [Text];
        nftMinted: ?Text;
    };
    
    // Simple player state
    type Player = {
        var location: Text;
        var inventory: [Text];
        var commandCount: Nat;
        var level: Nat;
        var xp: Nat;
        var credits: Nat;
        var visitedRooms: [Text];
        var gameCompleted: Bool;
    };
    
    // Storage - explicitly transient
    transient let players = Map.HashMap<Principal, Player>(10, Principal.equal, Principal.hash);
    
    // Game data - explicitly transient
    transient let rooms = [
        ("command_center", "Command Center 🖥️", "A high-tech command center with holographic displays.", "east:main_corridor,north:bridge"),
        ("main_corridor", "Main Corridor ⚡", "A long metallic corridor with flickering lights.", "west:command_center,north:armory,east:laboratory"),
        ("bridge", "Bridge 🚀", "The ship's bridge with a massive viewport.", "south:command_center"),
        ("armory", "Armory ⚔️", "Weapon storage with plasma rifles.", "south:main_corridor"),
        ("laboratory", "Laboratory 🧪", "Research facility with experiments.", "west:main_corridor")
    ];
    
    transient let items = [
        ("flashlight", "Flashlight 🔦", "Military-grade flashlight", 25),
        ("keycard", "Access Card 💳", "High-security access card", 50),
        ("rifle", "Plasma Rifle ⚡", "High-energy weapon", 500),
        ("data", "Research Data 💾", "Encrypted files", 300)
    ];
    
    // Get or create player
    private func getPlayer(principal: Principal) : Player {
        switch (players.get(principal)) {
            case (?player) { player };
            case null {
                let newPlayer = {
                    var location = "command_center";
                    var inventory = ["flashlight"];
                    var commandCount = 0;
                    var level = 1;
                    var xp = 0;
                    var credits = 100;
                    var visitedRooms = ["command_center"];
                    var gameCompleted = false;
                };
                players.put(principal, newPlayer);
                newPlayer;
            };
        };
    };
    
    // Find room by ID
    private func findRoom(roomId: Text) : ?(Text, Text, Text, Text) {
        for ((id, name, desc, exits) in rooms.vals()) {
            if (id == roomId) {
                return ?(id, name, desc, exits);
            };
        };
        null
    };
    
    // Find item by name
    private func findItem(itemName: Text) : ?(Text, Text, Text, Nat) {
        for ((id, name, desc, value) in items.vals()) {
            if (Text.contains(id, #text itemName) or Text.contains(name, #text itemName)) {
                return ?(id, name, desc, value);
            };
        };
        null
    };
    
    // Check if player has item
    private func hasItem(player: Player, itemId: Text) : Bool {
        for (item in player.inventory.vals()) {
            if (item == itemId) {
                return true;
            };
        };
        false
    };
    
    // Add XP and level up
    private func addXP(player: Player, amount: Nat) {
        player.xp += amount;
        let newLevel = (player.xp / 100) + 1;
        if (newLevel > player.level) {
            player.level := newLevel;
        };
    };
    
    // Main command processor
    public shared(msg) func processCommand(command: Text) : async GameResponse {
        let player = getPlayer(msg.caller);
        player.commandCount += 1;
        
        let words = Text.split(Text.toLowercase(command), #char ' ');
        let wordArray = Iter.toArray(words);
        
        if (wordArray.size() == 0) {
            return {
                message = "❓ Please enter a command. Type 'help' for commands.";
                gameState = await getGameState(msg.caller);
                newAchievements = [];
                nftMinted = null;
            };
        };
        
        let mainCommand = wordArray[0];
        let response = switch (mainCommand) {
            case "look" { handleLook(player) };
            case "go" { 
                if (wordArray.size() > 1) {
                    handleGo(player, wordArray[1])
                } else {
                    "🚶 Go where? Try 'go north' or 'go east'"
                }
            };
            case "take" { 
                if (wordArray.size() > 1) {
                    handleTake(player, wordArray[1])
                } else {
                    "📦 Take what? Try 'take keycard'"
                }
            };
            case "inventory" { handleInventory(player) };
            case "i" { handleInventory(player) };
            case "status" { handleStatus(player) };
            case "help" { handleHelp() };
            case _ { 
                "🤔 Unknown command: '" # mainCommand # "'. Type 'help' for commands."
            };
        };
        
        // Add XP
        addXP(player, 1);
        
        {
            message = response;
            gameState = await getGameState(msg.caller);
            newAchievements = [];
            nftMinted = null;
        }
    };
    
    // Command handlers
    private func handleLook(player: Player) : Text {
        switch (findRoom(player.location)) {
            case (?(_, name, desc, exits)) {
                var message = "📍 " # name # "\n\n" # desc # "\n\n";
                
                // Show available items
                switch (player.location) {
                    case "command_center" { 
                        if (not hasItem(player, "keycard")) {
                            message #= "Items: Access Card 💳\n";
                        };
                    };
                    case "armory" { 
                        if (not hasItem(player, "rifle")) {
                            message #= "Items: Plasma Rifle ⚡\n";
                        };
                    };
                    case "laboratory" { 
                        if (not hasItem(player, "data")) {
                            message #= "Items: Research Data 💾\n";
                        };
                    };
                    case _ { };
                };
                
                // Show exits
                message #= "Exits: ";
                let exitPairs = Text.split(exits, #char ',');
                for (exitPair in exitPairs) {
                    let parts = Text.split(exitPair, #char ':');
                    let partsArray = Iter.toArray(parts);
                    if (partsArray.size() > 0) {
                        message #= partsArray[0] # " ";
                    };
                };
                
                // Mark room as visited
                var found = false;
                for (visitedRoom in player.visitedRooms.vals()) {
                    if (visitedRoom == player.location) {
                        found := true;
                    };
                };
                if (not found) {
                    player.visitedRooms := Array.append(player.visitedRooms, [player.location]);
                };
                
                message
            };
            case null { "❌ Unknown location." };
        };
    };
    
    private func handleGo(player: Player, direction: Text) : Text {
        switch (findRoom(player.location)) {
            case (?(_, _, _, exits)) {
                let exitPairs = Text.split(exits, #char ',');
                for (exitPair in exitPairs) {
                    let parts = Text.split(exitPair, #char ':');
                    let partsArray = Iter.toArray(parts);
                    if (partsArray.size() >= 2 and partsArray[0] == direction) {
                        let newLocation = partsArray[1];
                        player.location := newLocation;
                        addXP(player, 5);
                        
                        switch (findRoom(newLocation)) {
                            case (?(_, name, desc, _)) {
                                return "🚶 You move " # direction # " to " # name # "\n\n" # desc;
                            };
                            case null { return "❌ Arrived at unknown location." };
                        };
                    };
                };
                "🚫 You can't go " # direction # " from here."
            };
            case null { "❌ Current location unknown." };
        };
    };
    
    private func handleTake(player: Player, itemName: Text) : Text {
        // Check if item is available in current room
        let availableItem = switch (player.location) {
            case "command_center" { 
                if (Text.contains(itemName, #text "card") or Text.contains(itemName, #text "keycard")) {
                    ?"keycard"
                } else { null }
            };
            case "armory" { 
                if (Text.contains(itemName, #text "rifle") or Text.contains(itemName, #text "weapon")) {
                    ?"rifle"
                } else { null }
            };
            case "laboratory" { 
                if (Text.contains(itemName, #text "data") or Text.contains(itemName, #text "research")) {
                    ?"data"
                } else { null }
            };
            case _ { null };
        };
        
        switch (availableItem) {
            case (?itemId) {
                if (not hasItem(player, itemId)) {
                    player.inventory := Array.append(player.inventory, [itemId]);
                    addXP(player, 3);
                    player.credits += 10;
                    
                    switch (findItem(itemId)) {
                        case (?(_, name, _, _)) {
                            "✅ You take the " # name # ". +3 XP, +10 credits!"
                        };
                        case null { "✅ Item taken!" };
                    };
                } else {
                    "❌ You already have that item."
                };
            };
            case null { "❌ There's no '" # itemName # "' here to take." };
        };
    };
    
    private func handleInventory(player: Player) : Text {
        var message = "🎒 Your Inventory:\n\n";
        
        if (player.inventory.size() == 0) {
            message #= "Your inventory is empty.";
        } else {
            for (itemId in player.inventory.vals()) {
                switch (findItem(itemId)) {
                    case (?(_, name, desc, value)) {
                        message #= "• " # name # " - " # desc # " (Value: " # Int.toText(value) # "₵)\n";
                    };
                    case null {
                        message #= "• " # itemId # "\n";
                    };
                };
            };
        };
        
        message
    };
    
    private func handleStatus(player: Player) : Text {
        "📊 Player Status:\n\n" #
        "Location: " # player.location # "\n" #
        "Level: " # Int.toText(player.level) # "\n" #
        "XP: " # Int.toText(player.xp) # " (Next level: " # Int.toText((player.level * 100) - player.xp) # " XP)\n" #
        "Credits: " # Int.toText(player.credits) # " 💰\n" #
        "Commands: " # Int.toText(player.commandCount) # "\n" #
        "Rooms Visited: " # Int.toText(player.visitedRooms.size()) # "/5\n" #
        "Items: " # Int.toText(player.inventory.size()) # "\n"
    };
    
    private func handleHelp() : Text {
        "🎮 **Cyberpunk Adventure Commands:**\n\n" #
        "**Movement:**\n" #
        "• go [direction] - Move around (north, south, east, west)\n\n" #
        "**Observation:**\n" #
        "• look - Examine your current area\n\n" #
        "**Items:**\n" #
        "• take [item] - Pick up items\n" #
        "• inventory (or i) - Check your items\n\n" #
        "**Information:**\n" #
        "• status - View your stats\n" #
        "• help - Show this help\n\n" #
        "**Examples:**\n" #
        "• look\n" #
        "• go north\n" #
        "• take keycard\n" #
        "• inventory\n\n" #
        "**Goal:** Explore all 5 rooms and collect items!"
    };
    
    // Get game state
    public shared query(msg) func getGameState(principal: Principal) : async GameState {
        let player = getPlayer(principal);
        
        {
            location = player.location;
            inventory = player.inventory;
            level = player.level;
            xp = player.xp;
            credits = player.credits;
            commandCount = player.commandCount;
            visitedRooms = player.visitedRooms.size();
            achievements = [];
            gameCompleted = player.gameCompleted;
        }
    };
    
    public query func getCanisterInfo() : async {version: Text; totalPlayers: Nat; totalCommands: Nat} {
        var totalCommands = 0;
        for ((_, player) in players.entries()) {
            totalCommands += player.commandCount;
        };
        
        {
            version = "1.0.0-working";
            totalPlayers = players.size();
            totalCommands = totalCommands;
        }
    };
}
