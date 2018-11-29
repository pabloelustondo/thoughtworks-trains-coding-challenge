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

// TYPES and CONSTANTS to represent the Direct Graph of Towns (nodes) and Direct Routes (links/distance)

// INPUT TYPES AND INPUT DATA SAMPLE, as provided by the requirements document.
type InputLink = string;
const inputLinks: InputLink[] = [
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

const NOROUTE = "NO SUCH ROUTE";
const DEFAULT_MAXIMUN_ROUTE_LENGTH = 11;
const DEFAULT_MAXIMUN_ROUTE_DISTANCE = 30;

// GRAPH MODEL

type TownName = string; // they are actually characters  A, B , C, D....
type Distance = number | string; // a nnuber or the word NOROUTE
type Route = TownName[]; // a route is just a sequence of towns.

class Link {
  // This class is just an abstraction to understand
  // the start town, destination town and distance from the the encoded string such as  "AB5"
  slink: string;
  constructor(slink: string) {
    this.slink = slink;
  }
  get destination(): TownName {
    return this.slink[1];
  }
  get start(): TownName {
    return this.slink[0];
  }
  get distance(): Distance {
    return parseInt(this.slink[2]);
  }
}

class GraphNode {
  // A node ins the graphs represents  a town with a set of unidireccional distances to some other towns
  // The towns that a town can reach are represented by the keys of the map linksMap
  linksMap: { [key: string]: Distance };
}

class Graph {
  // A graph is a set of GrapNodes per city. Each town has an entry in the Grap Map
  // The value of the entry, a GraphNode was explained before and contains the links.
  [key: string]: GraphNode;
}

// Kiwiland is the object that will do everything.
// It contains a graph and various functions to calculate rountes and also input and output data.

class Kiwiland {
  graph: Graph = new Graph(); //This is the graphs of towns and routes

  // FUNCTIONS USED TO LOAD THE INITIAL GRAPH FROM EXTERNAL DATA

  addLink(link: Link) {
    // Adds a link to the Graph
    if (!this.graph[link.start]) {
      this.graph[link.start] = new GraphNode();
      this.graph[link.start].linksMap = {};
    }
    this.graph[link.start].linksMap[link.destination] = link.distance;
  }

  loadGraphLinks(slinks: string[]) {
    // Loads all the provided input strings such as "AB5"..etc
    slinks.forEach(sl => {
      this.addLink(new Link(sl));
    });
  }

  // THE FOLLOWING THE FUNCTIONS ARE THE MOST IMPORTANT 
  // AND ARE USED TO CALCULATE THE SET OF ALL ROUTES ACCORDING TO PARAMETERS
  // NO FUNCTION BELOW THIS POINT WILL ALTER THE STATE OF THE GRAPH

  allRoutes(start: TownName, destination: TownName): Route[] {
    // All posible routes up to a certain maximun distance that we can find from Start to Destination
    // According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC
    return this.allRoutesRecursive([start], destination);
  }

  allRoutesRecursive(
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

    route: Route, //This is the current route from where you start calculating.
    // It is assumed that the route.length > 0
    // the beginning of any route is always the very original start town.
    destination: TownName, // This is always the same destination town being passed
    maxDistance: Distance = DEFAULT_MAXIMUN_ROUTE_DISTANCE, //This is an optional restriction  to only collect routes up to a certain route distance
    maxLength: number = DEFAULT_MAXIMUN_ROUTE_LENGTH //This is an optional restriction  to only collect routes up to a certain route length
  ): Route[] {
    // Again, the start of every route is the very original start 
    // and the end of the route is the current node being explored
    const currentNode = route[route.length - 1];

    // Here we avoid the possible infinite calculation by returning and empty set if the current length reaches the limit
    if (route.length >= maxLength) return [];

    const reachableTowns = this.graph[currentNode].linksMap;
    let routes: Route[] = []; // This is the total set of routes that is boing to be returned

    // Here we go link by link extending the current route into new routes longer.
    for (const town in reachableTowns) {
      const lroute = [...route, town]; // This is one of the new routes.
      if (
        town === destination &&  // we only collect routes that end in the destination
        this.routeDistance(lroute) <= maxDistance &&  // that have distance equal or less than maxDistance
        lroute.length <= maxLength  // and lenght equal or less than maxLength
      ) {
        routes.push(lroute); 
      }
      //Now, we recursivelly calculate all the routes starting from the new, longer, route
      const lroutes = this.allRoutesRecursive(
        lroute, // This route is one stop longer that the input route.
        destination,
        maxDistance,
        maxLength
      );
      //And finally we add all those new routes into our set
      routes = routes.concat(lroutes);
    }

    return routes; //we return the set of all routes starting from the received route.
  }

  // GETTER FUNCTIONS TO PRODUCE THE DESIRED RESULTS
  // ALL THESE FUNCTION DO NOT ALTER THE STATE OF THE GRAPH

  linkDistance(A: TownName, B: TownName): Distance {
    // Here we jsut get the distance between A and B by finding the value stored in the Maps
    return this.graph[A].linksMap[B] || NOROUTE;
  }

  routeDistance(route: Route): Distance {
    // the route distace is just the sum of the distances of all links between towns
    return route.reduce((acc: Distance, townName, i) => {
      if (i === 0) return 0;
      const distance: Distance = this.linkDistance(route[i - 1], townName);
      return distance === NOROUTE ? NOROUTE : <number>acc + <number>distance;
    }, 0);
  }

  allRoutesForAMaximunNumberOfStops(
    // thiwsfunction just filters the set to the ones up to a  provided number of steps
    start: TownName,
    destination: TownName,
    numberOfStops: number
  ): Route[] {
    return this.allRoutesRecursive(
      [start],
      destination,
      DEFAULT_MAXIMUN_ROUTE_DISTANCE,
      numberOfStops + 1
    );
  }

  allRoutesForANumberOfStops(
    // this function just filters the set to the ones with the exact provided number of steps
    start: TownName,
    destination: TownName,
    numberOfStops: number
  ): Route[] {
    return this.allRoutesForAMaximunNumberOfStops(
      start,
      destination,
      numberOfStops
    ).filter(route => route.length === numberOfStops + 1);
  }

  allOfRoutesMaximunDistance(
    // this function does the filter using the internal accepted mas distance
    start: TownName,
    destination: TownName,
    maxDistance: Distance
  ): Route[] {
    return this.allRoutesRecursive([start], destination, maxDistance);
  }

  shortestDistance(start: TownName, destination: TownName): Distance {
    return this.allRoutesRecursive([start], destination).reduce(
      (acc: Distance, route: Route) => {
        const distance = this.routeDistance(route);
        if (acc === NOROUTE) {
          return distance;
        } else {
          return distance < acc ? distance : acc;
        }
      },
      NOROUTE
    );
  }
}

// TESTING

// ALL TESTS ARE DONE WITH THE SAME WIKILAND OBJECT AS IT NOT SUPPOSED TO CHANGE
// KIWILAND FUNCTIONS DO NOT AFFECT THE GRAPH.

const kiwiland = new Kiwiland(); // CREATE THE GRAPH
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
print(`6. The number of trips starting at C and ending at C with a maximum of 3
stops.  In the sample data below, there are two such trips: C-D-C (2
stops). and C-E-B-C (3 stops).`);

const allRoutes6 = kiwiland.allRoutesForAMaximunNumberOfStops("C", "C", 3);
checkAndPrint(allRoutes6.length, 2);
printroutes(allRoutes6);

// TEST CASE 7
print(`7. The number of trips starting at A and ending at C with exactly 4 stops.
In the sample data below, there are three such trips: A to C (via B,C,D); A
to C (via D,C,D); and A to C (via D,E,B).`);

const allRoutes7 = kiwiland.allRoutesForANumberOfStops("A", "C", 4);
checkAndPrint(allRoutes7.length, 3);
printroutes(allRoutes7);

// TEST CASE 8
print(`8. The length of the shortest route (in terms of distance to travel) from A
to C.Output #8: 9`);
checkAndPrint(kiwiland.shortestDistance("A", "C"), 9);

// TEST CASE 9
print(`9. The length of the shortest route (in terms of distance to travel) from B
to B.Output #9: 9`);
checkAndPrint(kiwiland.shortestDistance("B", "B"), 9);

// TEST CASE 10
print(`10. The number of different routes from C to C with a distance of less than
30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC,
CEBCEBC, CEBCEBCEBC.`);

const allRoutes10 = kiwiland.allOfRoutesMaximunDistance("C", "C", 29);
checkAndPrint(allRoutes10.length, 7);
printroutes(allRoutes10);

print(`EVERYTHING LOOK GOOD!`);

// VERY SIMPLE UTILITY FUNCTIONS TO PRINT AND CHECK CONDITIONS

function checkAndPrint(response, answer) {
  if (response != answer)
    throw `Wrong answer, Expected ${answer} got ${response}`;
  console.log(`The response was ${response}`);
}

function print(o) {
  // print object nice
  console.log("");
  console.log(JSON.stringify(o, null, 2));
}

function printroutes(routes: Route[]) {
  // print routes array nice
  routes.forEach(r => {
    console.log(JSON.stringify(r.join(), null, 2));
  });
}
