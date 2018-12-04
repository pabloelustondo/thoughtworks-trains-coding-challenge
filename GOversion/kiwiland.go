package main

import "strings"
import "strconv"
import "errors"

// KWLTown a city in the graph. According to requirements that was a single letter like A, B , C
// But cleaerly that is too restrictive allowing only 256 Towns and I think it should be generalized....
// So, we will use strings.
type KWLTown string

// KWLLink represents a direct route from town A to town B and distance 5 such as AB5
// ALL strings have 3 characters, the first is the starting town, the second the destination town
// and the third one is the distance which ia one digit for now (
// this should be extended. I suggest using the notation A-B-5 to follow the other standard used
type KWLLink string

// KWLRoute represents a route from town A to town B with a set of zero or more stops, i.e: ABC
// Requirements do not specify how routes of less that two towns behave so we define it as zero
// In the case of routes the requirements are ambivalente, sometimes using A-B-C and sometimes ABC
// Eventually eE will support both versions. "ABC" is going to be called the "short form" A-B-C the default

type KWLRoute string

// Adds one more stop to an existinb route following the "-" convention
func addStop(r KWLRoute, s KWLTown) KWLRoute {
	return KWLRoute(string(r) + "-" + string(s))
}

// KWLDistance represents the distance of a route or direct route. this is an integer
// Requirements do not specify how routes of less that two towns behave so we defined it as zero
// If a route is not posible the distance will be represented by the constant NOROUTE
type KWLDistance int

// NOROUTE represents the distances of a non existent route
const NOROUTE = -1

// KWLGraphNode represents a node for a town in Kiwilang Graph.
// The key represent reachable towns such as 'B' and the value is the distance.
// A more efficient representation that could be used it to refer to the city with an ID and keep the stringss in a map.
type KWLGraphNode map[KWLTown]int

// KWLGraph represents a Kiwiland Graph.
// The key represent towns auch as 'A' and the value is a GraphNode
type KWLGraph map[KWLTown]KWLGraphNode

// KWLOptions lets us specify options whe calling the calculation of routes
type KWLOptions struct {
	maxRouteDistance int
	maxRouteLength   int
	minRouteLength   int
}

// This function is used to add links to the graph. Initially only accepting the "short" notation.
// This shouldbe extended with another function accepting a more scalable notation.
func (g KWLGraph) addLink(l KWLLink) error {

	if len(l) != 3 {
		return errors.New(ErrorInputLinksMustHave3Characters)
	}
	townA := KWLTown(l[0])
	townB := KWLTown(l[1])
	distance, error := strconv.Atoi(string(l[2]))

	if g[townA] == nil {
		g[townA] = make(KWLGraphNode)
	}

	g[townA][townB] = distance
	return error
}

// This function uses the function defined before to load the input links representaed with strings.
func (g KWLGraph) loadGraphLinks(links []KWLLink) error {

	for _, element := range links {
		error := g.addLink(element)
		if error != nil {
			return error
		}
	}
	return nil
}

// This unctions is used to calculate the route distance. True, it does look like one less elegant 
// than the one we did in Javascript before. We did it this way to keep using strings as a data structure
// Anyway, this function is only used to run the required tests but is not used for internal calculations.
func (g KWLGraph) routeDistance(route KWLRoute) KWLDistance {
	var routeArray = strings.Split(string(route), "-")
	var accumulator int //in Go defaults to O...
	var prevTown KWLTown
	for pos := range routeArray {
		currentTown := KWLTown(routeArray[pos])
		if pos > 0 {
			// Then we have a prevTown
			distance := g[prevTown][currentTown]
			if distance == 0 {
				return NOROUTE
			}
			accumulator = accumulator + distance
		}
		prevTown = currentTown
	}
	return KWLDistance(accumulator)
}

// Finally, this is the really important function. 
// Given a graph, It calculates ALL the routes from "start" to "destination"
// the options parameter let the caller specify certain different alternatives for the calculation.
// Anyway, this function is just a wrapper of the function that really does the work which is recursive
func (g KWLGraph) allRoutes(
  start KWLTown, 
  destination KWLTown, 
  options KWLOptions) ([]KWLRoute, KWLDistance, error) {
	// All possible routes up to a certain maximun distance that we can find from Start to Destination
	// Note: According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC

	routes, minDistance, err := g.allRoutesRecursive(KWLRoute(start), start, 1, 0, destination, options)

	return routes, minDistance, err
}

// This is the actual function that calculates all the routes using recursion.
// REcursion is pretty efficient and elegant for  this problem as the length of the stack
// is the length of the maximum routes which can go a long way with a number in the hundreds.
// This is how it works. Suppose you want to go from A to B and you have already moved from A to some C. 
// Say, the current travelled route is ADC. Now from C, you can use direct links to go to H and G and B
// So, you found a route ABCB, and you can return that. However, also, maybe there are more routes from H and G.
// So, you recursively call the program to calculate all the routes from H and G using the route ABCH and ABCG.
// Unless, of course, you have reached the maximum length or maximum distance. That is the base of the recursion.
// Finally, you put together all these routes together, and you return all that.

func (g KWLGraph) allRoutesRecursive(
	route KWLRoute,
	lastTown KWLTown,
	routeLength int,
	routeDistance int,
	destination KWLTown,
	options KWLOptions) ([]KWLRoute, KWLDistance, error) {
	// All posible routes up to a certain maximun distance that we can find from Start to Destination
	// Note: According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC
  var err error
  var minDistance KWLDistance = NOROUTE
	routes := []KWLRoute{}
	reachableTowns := g[lastTown]
	for ltown, ldistance := range reachableTowns {
		lroute := addStop(route, ltown)
		lrouteDistance := routeDistance + ldistance
		lrouteLength := routeLength + 1
		if lrouteDistance <= options.maxRouteDistance && lrouteLength <= options.maxRouteLength {
			if ltown == destination && lrouteLength >= options.minRouteLength {
				//add the route to the list
        routes = append(routes, lroute)
        minDistance = calculateMinDistance(minDistance, KWLDistance(lrouteDistance))
			}
			lroutes, lminDistance, lerr := g.allRoutesRecursive(lroute, ltown, lrouteLength, lrouteDistance, destination, options)
      minDistance = calculateMinDistance(minDistance, lminDistance)
      routes = append(routes, lroutes...)
      err = lerr   // TODO concatenate errors?
		}
	}
	return routes, minDistance, err
}

// This is a simple helper to deal with NOROUTE when finding the minimun.
func calculateMinDistance(minDistance KWLDistance, routeDistance KWLDistance) KWLDistance {
	if routeDistance == NOROUTE {
		return minDistance
	}
	if minDistance == NOROUTE || minDistance > KWLDistance(routeDistance) {
		return KWLDistance(routeDistance)
	}
	return minDistance
}