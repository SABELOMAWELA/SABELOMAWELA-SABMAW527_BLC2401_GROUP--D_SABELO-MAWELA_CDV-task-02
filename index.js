/**
 * A list of roads in the village
 * @type {string[]}
 */
const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
];

/**
 * Builds a graph from a list of edges
 *
 * @param {string[]} edges - A list of edges in the format "from-to"
 * @returns {Object} - A graph object where each key is a node and its value is an array of neighboring nodes
 * @example
 * const graph = buildGraph([
 *   "A-B",
 *   "A-C",
 *   "B-D",
 *   "C-D"
 * ]);
 * // graph = { A: ["B", "C"], B: ["A", "D"], C: ["A", "D"], D: ["B", "C"] }
 */
function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if (graph[from] == null) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads);

/**
 * Represents the state of the village, including the current location and parcels
 *
 * @class VillageState
 * @param {string} place - The current location
 * @param {Object[]} parcels - An array of parcels, each with a place and address
 */
class VillageState {
    /**
     * @constructor
     * @param {string} place - The current location
     * @param {Object[]} parcels - An array of parcels, each with a place and address
     */
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    /**
     * Move to a new location
     *
     * @param {string} destination - The new location
     * @returns {VillageState} - A new VillageState object with the updated location and parcels
     * @example
     * let state = new VillageState("Post Office", [{place: "Post Office", address: "Alice's House"}]);
     * let nextState = state.move("Alice's House");
     * console.log(nextState.place); // "Alice's House"
     * console.log(nextState.parcels); // [{place: "Alice's House", address: "Alice's House"}]
     */
    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;
                return { place: destination, address: p.address };
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

// Example usage:
let first = new VillageState(
    "Post Office",
    [{ place: "Post Office", address: "Alice's House" }]
);
let next = first.move("Alice's House");

console.log(next.place); // Alice's House
console.log(next.parcels); // []
console.log(first.place); // Post Office

/**
 * Runs a robot in the village
 *
 * @param {VillageState} state - The initial state of the village
 * @param {function} robot - A function that takes the current state and returns an action
 * @param {*} memory - The initial memory of the robot
 */
function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
        if (state.parcels.length == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

/**
 * Returns a random element from an array
 *
 * @param {any[]} array - The array to pick from
 * @returns {*} - A random element from the array
 */
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

/**
 * A robot that moves randomly
 *
 * @param {VillageState} state - The current state of the village
 * @returns {Object} - An action object containing direction and memory
 */
function randomRobot(state) {
    return { direction: randomPick(roadGraph[state.place]) };
}

// Example of running the random robot:
runRobot(first, randomRobot);
