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
// and the third one is the distance which ia one digit for now (this should be extended)
type KWLLink string

// KWLRoute represents a route from town A to town B with a set of zero or more stops, i.e: ABC
// Requirements do not specify how routes of less that two towns behave soe we define it as zero
// In the case of routes the requirements are ambivalente, sometimes using A-B-C and sometimes ABC
// WE will support both versions. "ABC" is oging to be called the "short form" A-B-C the default
type KWLRoute string

func addStop(r KWLRoute, s KWLTown) KWLRoute {
	return KWLRoute(string(r) + "-" + string(s))
}

// KWLDistance represents the distance of a route or direct route. this is an integet
// Requirements do not specify how routes of less that two towns behave soe we define it as zero
// If a route is not posible the distance will be represented by the constant NOROUTE
type KWLDistance int

// NOROUTE represents the distances of a non existent route
const NOROUTE = -1

// KWLGraphNode represents a node for a town in Kiwilang Graph.
// The key represent reachable towns such as 'B' and the  value is the distance.
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

func (g KWLGraph) loadGraphLinks(links []KWLLink) error {

	for _, element := range links {
		error := g.addLink(element)
		if error != nil {
			return error
		}
	}
	return nil
}

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

func (g KWLGraph) allRoutes(
  start KWLTown, 
  destination KWLTown, 
  options KWLOptions) ([]KWLRoute, KWLDistance, error) {
	// All possible routes up to a certain maximun distance that we can find from Start to Destination
	// Note: According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC

	routes, minDistance, err := g.allRoutesRecursive(KWLRoute(start), start, 1, 0, destination, options)

	return routes, minDistance, err
}

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

func calculateMinDistance(minDistance KWLDistance, routeDistance KWLDistance) KWLDistance {
	if routeDistance == NOROUTE {
		return minDistance
	}
	if minDistance == NOROUTE || minDistance > KWLDistance(routeDistance) {
		return KWLDistance(routeDistance)
	}
	return minDistance
}