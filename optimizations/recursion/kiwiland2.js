"use strict";
// This is an optimized version of the original solution.
// This code is harder to understand, so please, read teh README and the first version before.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOROUTE = "NO SUCH ROUTE";
var DEFAULT_MAXIMUN_ROUTE_LENGTH = 11;
var DEFAULT_MAXIMUN_ROUTE_DISTANCE = 30;
var Link = /** @class */ (function () {
    function Link(slink) {
        this.slink = slink;
    }
    Object.defineProperty(Link.prototype, "destination", {
        get: function () {
            return this.slink[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "start", {
        get: function () {
            return this.slink[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "distance", {
        get: function () {
            return parseInt(this.slink[2]);
        },
        enumerable: true,
        configurable: true
    });
    return Link;
}());
var GraphNode = /** @class */ (function () {
    function GraphNode() {
    }
    return GraphNode;
}());
var Graph = /** @class */ (function () {
    function Graph() {
    }
    return Graph;
}());
// KIWILAND Class does everything
// It contains a graph and various functions to calculate rountes and also input and output data.
var Kiwiland = /** @class */ (function () {
    function Kiwiland() {
        this.graph = new Graph(); //This is the graphs of towns and routes
    }
    // FUNCTIONS USED TO LOAD THE INITIAL GRAPH FROM EXTERNAL DATA
    Kiwiland.prototype.addLink = function (link) {
        // Adds a link to the Graph
        if (!this.graph[link.start]) {
            this.graph[link.start] = new GraphNode();
            this.graph[link.start] = {};
        }
        this.graph[link.start][link.destination] = link.distance;
    };
    Kiwiland.prototype.loadGraphLinks = function (slinks) {
        var _this = this;
        // Loads all the provided input strings such as "AB5"..etc
        slinks.forEach(function (sl) {
            _this.addLink(new Link(sl));
        });
    };
    // THE FOLLOWING THE FUNCTIONS ARE THE MOST IMPORTANT
    // AND ARE USED TO CALCULATE THE SET OF ALL ROUTES ACCORDING TO PARAMETERS
    Kiwiland.prototype.allRoutes = function (start, destination) {
        // All posible routes up to a certain maximun distance that we can find from Start to Destination
        // Note: According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC
        return this.allRoutesRecursive([start], destination);
    };
    Kiwiland.prototype.allRoutesRecursive = function (routeIn, // current route to start calculating the set
    destination, // This is always the same destination town being passed
    maxDistance, maxLength) {
        if (maxDistance === void 0) { maxDistance = DEFAULT_MAXIMUN_ROUTE_DISTANCE; }
        if (maxLength === void 0) { maxLength = DEFAULT_MAXIMUN_ROUTE_LENGTH; }
        var routes = [];
        var routesForLength = [routeIn];
        for (var routeLength = 2; routeLength <= maxLength; routeLength++) {
            var routesForNewLength = [];
            for (var r = 0; r < routesForLength.length; r++) {
                var route = routesForLength[r];
                var lastTown = route[route.length - 1];
                var reachableTowns = this.graph[lastTown];
                for (var town in reachableTowns) {
                    var lroute = route.concat([town]); // This is one of the new routes.
                    var lrouteDistance = this.routeDistance(lroute);
                    if (lrouteDistance <= maxDistance && // that have distance equal or less than maxDistance
                        lroute.length <= maxLength // and lenght equal or less than maxLength
                    ) {
                        routesForNewLength.push(lroute);
                        if (town === destination) {
                            routes.push(lroute);
                        }
                    }
                }
            }
            routesForLength.forEach(function (_, i) { return delete routesForLength[i]; });
            routesForLength = routesForNewLength;
        }
        return routes; //we return the set of all routes starting from the received route.
    };
    // GETTER FUNCTIONS TO PRODUCE THE DESIRED RESULTS
    // ALL THESE FUNCTION DO NOT ALTER THE STATE OF THE GRAPH
    Kiwiland.prototype.linkDistance = function (A, B) {
        // Here we jsut get the distance between A and B by finding the value stored in the Maps
        return this.graph[A][B] || exports.NOROUTE;
    };
    Kiwiland.prototype.routeDistance = function (route) {
        var _this = this;
        // the route distace is just the sum of the distances of all links between towns
        return route.reduce(function (acc, townName, i) {
            if (i === 0)
                return 0;
            var distance = _this.linkDistance(route[i - 1], townName);
            return distance === exports.NOROUTE ? exports.NOROUTE : acc + distance;
        }, 0);
    };
    Kiwiland.prototype.allRoutesForAMaximunNumberOfStops = function (
    // thiwsfunction just filters the set to the ones up to a  provided number of steps
    start, destination, numberOfStops) {
        return this.allRoutesRecursive([start], destination, DEFAULT_MAXIMUN_ROUTE_DISTANCE, numberOfStops + 1);
    };
    Kiwiland.prototype.allRoutesForANumberOfStops = function (
    // this function just filters the set to the ones with the exact provided number of steps
    start, destination, numberOfStops) {
        return this.allRoutesForAMaximunNumberOfStops(start, destination, numberOfStops).filter(function (route) { return route.length === numberOfStops + 1; });
    };
    Kiwiland.prototype.allOfRoutesMaximunDistance = function (
    // this function does the filter using the internal accepted mas distance
    start, destination, maxDistance) {
        return this.allRoutesRecursive([start], destination, maxDistance);
    };
    Kiwiland.prototype.shortestDistance = function (start, destination) {
        var _this = this;
        return this.allRoutesRecursive([start], destination).reduce(function (acc, route) {
            var distance = _this.routeDistance(route);
            if (acc === exports.NOROUTE) {
                return distance;
            }
            else {
                return distance < acc ? distance : acc;
            }
        }, exports.NOROUTE);
    };
    return Kiwiland;
}());
exports.Kiwiland = Kiwiland;
//# sourceMappingURL=kiwiland2.js.map