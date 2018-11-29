/*
This code is a simple proof of concept (POC) to solve the famous Thoughworks Trains coding challenge
in a very simple / short way.
The code pass the provided tests and is very small with no dependencies execpt Node.js and Typescript
However, This is not production-ready code. It will notscale for large graphs.
The main goals is to clarify/understand requirements and provide a working prototype.
Production ready code will need improvements in performance, scalability, test coverage and error handling.
Depending on load requirements this code maybe need to be implemented in another language such as GO.
Please read the README for more detailed explanations of the goal and the requirements.
Anyway, we believe this code is a very clear and conceptual solution that help to get a good insight.
*/
var inputLinks = [
    "AB5",
    "BC4",
    "CD8",
    "DC8",
    "DE6",
    "AD5",
    "CE2",
    "EB3",
    "AE7"
];
// DEFAULT CONSTANTS TO RESTRICT THE POTENTIAL GENERATION OF INFINITE SET OF ROUTES
// According to the definitions, the set of routes include routes with loops such as: CEBCEBCEBC
// So, the set of all posible routes is infinite. I use default limits that still satisfy all the requirements
var NOROUTE = "NO SUCH ROUTE";
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
// Kiwiland is the object that will do everything.
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
            this.graph[link.start].linksMap = {};
        }
        this.graph[link.start].linksMap[link.destination] = link.distance;
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
    // NO FUNCTION BELOW THIS POINT WILL ALTER THE STATE OF THE GRAPH
    Kiwiland.prototype.allRoutes = function (start, destination) {
        // All posible routes up to a certain maximun distance that we can find from Start to Destination
        // According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC
        return this.allRoutesRecursive([start], destination);
    };
    Kiwiland.prototype.allRoutesRecursive = function (
    /*
    This method recursivelly calculates all routes up to a certain maximun length
    This is the idea: Suppose we have solve the problem of calculating all routes from A to B up to certain maximun length or distance.
    So, we can start from the beginning and createthe first routes based on direct links and then
    recursivelly calcualate the sets starting from there.
    This is the reason why we keep passing the current route. That current route keep growing in each call.
    By default we have a maximun length of 11. That will result into a call stakc of size 11 which is not bad.
    We can create the new routes by adding our adjacent links to our current route.
    Anyway, altough elegant and easy to understand,
    this implementation should be refactored to transforme the recursion with loop for more scalability.
    */
    route, //This is the current route from where you start calculating.
    // It is assumed that the route.length > 0
    // the beginning of any route is always the very original start town.
    destination, // This is always the same destination town being passed
    maxDistance, //This is an optional restriction  to only collect routes up to a certain route distance
    maxLength //This is an optional restriction  to only collect routes up to a certain route length
    ) {
        if (maxDistance === void 0) { maxDistance = DEFAULT_MAXIMUN_ROUTE_DISTANCE; }
        if (maxLength === void 0) { maxLength = DEFAULT_MAXIMUN_ROUTE_LENGTH; }
        // Again, the start of every route is the very original start 
        // and the end of the route is the current node being explored
        var currentNode = route[route.length - 1];
        // Here we avoid the possible infinite calculation by returning and empty set if the current length reaches the limit
        if (route.length >= maxLength)
            return [];
        var reachableTowns = this.graph[currentNode].linksMap;
        var routes = []; // This is the total set of routes that is boing to be returned
        // Here we go link by link extending the current route into new routes longer.
        for (var town in reachableTowns) {
            var lroute = route.concat([town]); // This is one of the new routes.
            if (town === destination && // we only collect routes that end in the destination
                this.routeDistance(lroute) <= maxDistance && // that have distance equal or less than maxDistance
                lroute.length <= maxLength // and lenght equal or less than maxLength
            ) {
                routes.push(lroute);
            }
            //Now, we recursivelly calculate all the routes starting from the new, longer, route
            var lroutes = this.allRoutesRecursive(lroute, // This route is one stop longer that the input route.
            destination, maxDistance, maxLength);
            //And finally we add all those new routes into our set
            routes = routes.concat(lroutes);
        }
        return routes; //we return the set of all routes starting from the received route.
    };
    // GETTER FUNCTIONS TO PRODUCE THE DESIRED RESULTS
    // ALL THESE FUNCTION DO NOT ALTER THE STATE OF THE GRAPH
    Kiwiland.prototype.linkDistance = function (A, B) {
        // Here we jsut get the distance between A and B by finding the value stored in the Maps
        return this.graph[A].linksMap[B] || NOROUTE;
    };
    Kiwiland.prototype.routeDistance = function (route) {
        var _this = this;
        // the route distace is just the sum of the distances of all links between towns
        return route.reduce(function (acc, townName, i) {
            if (i === 0)
                return 0;
            var distance = _this.linkDistance(route[i - 1], townName);
            return distance === NOROUTE ? NOROUTE : acc + distance;
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
            if (acc === NOROUTE) {
                return distance;
            }
            else {
                return distance < acc ? distance : acc;
            }
        }, NOROUTE);
    };
    return Kiwiland;
}());
// TESTING
// ALL TESTS ARE DONE WITH THE SAME WIKILAND OBJECT AS IT NOT SUPPOSED TO CHANGE
// KIWILAND FUNCTIONS DO NOT AFFECT THE GRAPH.
var kiwiland = new Kiwiland(); // CREATE THE GRAPH
kiwiland.loadGraphLinks(inputLinks); // LOAD THE TESTING DATA
// TEST CASE 1
print("1. The distance of the route A-B-C. Output #1: 9.....");
checkAndPrint(kiwiland.routeDistance(["A", "B", "C"]), 9);
// TEST CASE 2
print("2. The distance of the route A-D. Output #2: 5");
checkAndPrint(kiwiland.routeDistance(["A", "D"]), 5);
// TEST CASE 3
print("3. The distance of the route A-D-C. Output #3: 13");
checkAndPrint(kiwiland.routeDistance(["A", "D", "C"]), 13);
// TEST CASE 4
print("4. The distance of the route A-E-B-C-D. Output #4: 22");
checkAndPrint(kiwiland.routeDistance(["A", "E", "B", "C", "D"]), 22);
// TEST CASE 5
print("5. The distance of the route A-E-D. Output #5: NO SUCH ROUTE");
checkAndPrint(kiwiland.routeDistance(["A", "E", "D"]), NOROUTE);
// TEST CASE 6
print("6. The number of trips starting at C and ending at C with a maximum of 3\nstops.  In the sample data below, there are two such trips: C-D-C (2\nstops). and C-E-B-C (3 stops).");
var allRoutes6 = kiwiland.allRoutesForAMaximunNumberOfStops("C", "C", 3);
checkAndPrint(allRoutes6.length, 2);
printroutes(allRoutes6);
// TEST CASE 7
print("7. The number of trips starting at A and ending at C with exactly 4 stops.\nIn the sample data below, there are three such trips: A to C (via B,C,D); A\nto C (via D,C,D); and A to C (via D,E,B).");
var allRoutes7 = kiwiland.allRoutesForANumberOfStops("A", "C", 4);
checkAndPrint(allRoutes7.length, 3);
printroutes(allRoutes7);
// TEST CASE 8
print("8. The length of the shortest route (in terms of distance to travel) from A\nto C.Output #8: 9");
checkAndPrint(kiwiland.shortestDistance("A", "C"), 9);
// TEST CASE 9
print("9. The length of the shortest route (in terms of distance to travel) from B\nto B.Output #9: 9");
checkAndPrint(kiwiland.shortestDistance("B", "B"), 9);
// TEST CASE 10
print("10. The number of different routes from C to C with a distance of less than\n30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC,\nCEBCEBC, CEBCEBCEBC.");
var allRoutes10 = kiwiland.allOfRoutesMaximunDistance("C", "C", 29);
checkAndPrint(allRoutes10.length, 7);
printroutes(allRoutes10);
print("EVERYTHING LOOK GOOD!");
// VERY SIMPLE UTILITY FUNCTIONS TO PRINT AND CHECK CONDITIONS
function checkAndPrint(response, answer) {
    if (response != answer)
        throw "Wrong answer, Expected " + answer + " got " + response;
    console.log("The response was " + response);
}
function print(o) {
    // print object nice
    console.log("");
    console.log(JSON.stringify(o, null, 2));
}
function printroutes(routes) {
    // print routes array nice
    routes.forEach(function (r) {
        console.log(JSON.stringify(r.join(), null, 2));
    });
}
//# sourceMappingURL=kiwiland.js.map