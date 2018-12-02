// This is an optimized version of the original solution.
// This code is harder to understand, so please, read teh README and the first version before.

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

  allRoutes(start: TownName, destination: TownName): Route[] {
    // All posible routes up to a certain maximun distance that we can find from Start to Destination
    // Note: According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC
    return this.allRoutesRecursive([start], destination);
  }

  allRoutesRecursive(
    routeIn: Route, // current route to start calculating the set
    destination: TownName, // This is always the same destination town being passed
    maxDistance: Distance = DEFAULT_MAXIMUN_ROUTE_DISTANCE,
    maxLength: number = DEFAULT_MAXIMUN_ROUTE_LENGTH
  ): Route[] {
    let routes: Route[] = [];

    let routesForLength: Route[] = [routeIn];
    for (let routeLength = 2; routeLength <= maxLength; routeLength++) {
      let routesForNewLength: Route[] = [];

      for (let r = 0; r < routesForLength.length; r++) {
        const route = routesForLength[r];
        const lastTown = route[route.length - 1];
        const reachableTowns = this.graph[lastTown];

        for (const town in reachableTowns) {
          const lroute = [...route, town]; // This is one of the new routes.
          const lrouteDistance = this.routeDistance(lroute);

          if (
            lrouteDistance <= maxDistance && // that have distance equal or less than maxDistance
            lroute.length <= maxLength // and lenght equal or less than maxLength
          ) {
            routesForNewLength.push(lroute);
            if (town === destination) {
              routes.push(lroute);
            }
          }
        }
      }
      routesForLength.forEach ((_,i) => delete  routesForLength[i]);
      routesForLength = routesForNewLength;
    }

    return routes; //we return the set of all routes starting from the received route.
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
