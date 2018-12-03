// Please read the README file to understand the pourpose and limitations of thie code

// DEFAULT CONSTANTS TO RESTRICT THE POTENTIAL GENERATION OF INFINITE SET OF ROUTES
// According to the definitions, the set of routes include routes with loops such as: CEBCEBCEBC

export const NOROUTE = "NO SUCH ROUTE";
const DEFAULT_MAXIMUN_ROUTE_LENGTH = 11;
const DEFAULT_MAXIMUN_ROUTE_DISTANCE = 30;

// GRAPH MODEL

export type InputLink = string; // to model the input links AB5..AC6...etc
export type TownName = string; // they are actually characters  A, B , C, D....
export type Distance = number | string; // a nnuber or the word NOROUTE
export type Route = TownName[]; // a route is just a sequence of towns incuding loops such as CEBCEBCEBC

class Link {
  // This class is just an abstraction to interpret an encoded string such as  "AB5"
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
  // A node in the graph represents a town with a set of unidireccional distances to some other towns
  [key: string]: Distance;
}

class Graph {
  // A graph is a set of GrapNodes per city. Each town has an entry in the Grap Map
  [key: string]: GraphNode;
}


// ROUTE TREE
// The idea here is that istead of using an array of routes Route[] as we did in the first 
// version. Now, we are going to use a Tree. This is theoretically, going to reduce the 
// size of the heap that is needed to store the routes.

export class RouteTree {
  town: TownName;
  links: {[key: string]: RouteTree};

  constructor(town: TownName){
    this.town = town;
    this.links = {}
  }
}

// KIWILAND Class does everything
// It contains a graph and various functions to calculate rountes and also input and output data.

export class Kiwiland {
  graph: Graph = new Graph(); //This is the graphs of towns and routes

  // FUNCTIONS USED TO LOAD THE INITIAL GRAPH FROM EXTERNAL DATA

  addLink(link: Link) {
    // Adds a link to the Graph
    if (!this.graph[link.start]) {
      this.graph[link.start] = new GraphNode();
      this.graph[link.start] = {};
    }
    this.graph[link.start][link.destination] = link.distance;
  }

  loadGraphLinks(slinks: string[]) {
    // Loads all the provided input strings such as "AB5"..etc
    slinks.forEach(sl => {
      this.addLink(new Link(sl));
    });
  }

  // THE FOLLOWING THE FUNCTIONS ARE THE MOST IMPORTANT
  // AND ARE USED TO CALCULATE THE SET OF ALL ROUTES ACCORDING TO PARAMETERS

  allRoutes(start: TownName, destination: TownName): Route[]  {
    // All posible routes up to a certain maximun distance that we can find from Start to Destination
    // Note: According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC
    let treeRoute = this.allRoutesRecursive([start], destination);
    console.log(treeRoute.town);
    return []
  }

  allRoutesRecursive(
    /*
    This method recursively calculates all routes up to a specified maximum number of stop (length) 
    and uses de 'depth-first' approach
    Conceptually, to solve the problem of calculating all the routes from A to B 
    up to a specified maximum length 'n', we assume we know how to solve the problem for n-1 and the base case n=0.
    So, start from the starting town and create the first routes based on the available direct links. 
    Then recursively we calculate the routes that start from the last town in the route. 
    The routes in this new subset are smaller than n.
    Controlling the recursion is the reason why we keep passing the current route. 
    That current route keeps growing in each call getting closer to "n"
    An optimized, a more scalable version may want to refactor the recursion with a sequential loop.
    Note: We also use the maximum distance to stop the recursion 
    due to requirements ask both about sets of routes up to some "stops" and also up to a distance.
    */

    route: Route, // current route to start calculating the set
    destination: TownName, // This is always the same destination town being passed
    maxDistance: Distance = DEFAULT_MAXIMUN_ROUTE_DISTANCE,
    maxLength: number = DEFAULT_MAXIMUN_ROUTE_LENGTH
  ): RouteTree {
    // The start of every route is the very original start
    // The end of the route is where the route generations needs to start
    const currentTown = route[route.length - 1];
    const reachableTowns = this.graph[currentTown];
    let routeTree: RouteTree = null; // This is the total set of routes that is going to be returned
    // Notice later that  if maxDistance or MaxLength were reached thi function will return the empty seet.

    // Here we go link by link creating new routes longer.
    for (const town in reachableTowns) {
      const lroute = [...route, town]; // This is one of the new routes.
     // const lrouteDistance = this.routeDistance(lroute);
 


      if (
      //  lrouteDistance <= maxDistance && // that have distance equal or less than maxDistance
        lroute.length <= maxLength // and lenght equal or less than maxLength
      ) {
        if (
          town === destination // we only collect routes that end in the destination
        ) {
          routeTree = new RouteTree(currentTown);
        }

        //Now, we recursivelly calculate all the routes starting from the new, longer, route
        const lrouteTree = this.allRoutesRecursive(
          lroute, // This route is one stop longer that the input route.
          destination,
          maxDistance,
          maxLength
        );
        //And finally we add all those new routes into our set
        if (lrouteTree !== null){
          if (routeTree === null){
            routeTree = new RouteTree(currentTown);
          }
          routeTree.links[town] = lrouteTree;
        }

      }
    }

    return routeTree; //we return the set of all routes starting from the received route.
  }

  // GETTER FUNCTIONS TO PRODUCE THE DESIRED RESULTS
  // ALL THESE FUNCTION DO NOT ALTER THE STATE OF THE GRAPH

  linkDistance(A: TownName, B: TownName): Distance {
    // Here we jsut get the distance between A and B by finding the value stored in the Maps
    return this.graph[A][B] || NOROUTE;
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
    return []
    /*
    return this.allRoutesRecursive(
      [start],
      destination,
      DEFAULT_MAXIMUN_ROUTE_DISTANCE,
      numberOfStops + 1
    );
    */
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
    //return this.allRoutesRecursive([start], destination, maxDistance);
    return []
  }

  shortestDistance(start: TownName, destination: TownName): Distance {
    return 10
    /*
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
    */
  }
}
