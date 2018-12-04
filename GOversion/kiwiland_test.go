package main


/*
TO TEST
distances cannot be zero ... prevent this during adding links
constants should only be declared when we are in the program.,,noti in the twststb  overkiell
cover function add Stop route
*/

import (
	//"fmt"
	"testing"
	//	"errors"
)

func TestKWLGraphAddGoodLink(t *testing.T) {
	g := make(KWLGraph)
	error := g.addLink("AB5")

	if error != nil {
		t.Errorf("TestKWLGraphAddLink failed for %v - error", error)
	}
	if g["A"]["B"] != 5 {
		t.Errorf("TestKWLGraphAddLink failed for %v - bad distance", "AB5")
	}
}

func TestKWLGraphReportsBadFormedLinks(t *testing.T) {
	g := make(KWLGraph)
	if g.addLink("ABC").Error() != ErrorInputLinkLastCharacterMustBeNumber {
		t.Errorf("Should have returned an error when distance is not integer")
	}
	if g.addLink("AB").Error() != ErrorInputLinksMustHave3Characters {
		t.Errorf("Should have returned an error when string less than 3 characters")
	}
	if g.addLink("ABCD").Error() != ErrorInputLinksMustHave3Characters {
		t.Errorf("Should have returned an error when string more than 3 characters")
	}
}

func TestKWLGraphAddGoodLinkArray(t *testing.T) {

	inputLinks := []KWLLink {"AB5","BC4","CD8","DC8","DE6","AD5","CE2", "EB3","AE7"};

	g := make(KWLGraph)
	error := g.loadGraphLinks(inputLinks)

	if error != nil {
		t.Errorf(ErrorLoadGraphLinksFailedWithException, error)
	}
	if g["A"]["B"] != 5 {
		t.Errorf(ErrorLoadGraphLinksWrongDistance, "AB5", g["A"]["B"])
	}
	if g["B"]["C"] != 4 {
		t.Errorf(ErrorLoadGraphLinksWrongDistance, "BC4", g["B"]["C"])
	}
}

func TestKWLGraphReportBadLinkArray(t *testing.T) {

	inputLinks := []KWLLink {"ABC"};

	g := make(KWLGraph)
	error := g.loadGraphLinks(inputLinks)

	if error.Error() != ErrorInputLinkLastCharacterMustBeNumber {
		t.Errorf("Should have returned an error when distance is not integer")
	}

}

func TestKWLRouteDistance(t *testing.T) {

	// We create a sample Graph
	inputLinks := []KWLLink {"AB5","BC4","CD8","DC8","DE6","AD5","CE2", "EB3","AE7"};
	g := make(KWLGraph)
	error := g.loadGraphLinks(inputLinks)  

	if error != nil {
		t.Errorf(ErrorLoadGraphLinksFailedWithException, error)
	}

	// Test some routes

	distanceAB := g.routeDistance("A-B")

	if distanceAB == NOROUTE {
		t.Errorf(ErrorWrongRouteDistanceCalculationNOROUTE)
	}

	if distanceAB != 5 {
		t.Errorf(ErrorWrongRouteDistanceCalculation)
	}

	distanceAB = g.routeDistance("A-H")

	if distanceAB != NOROUTE {
		t.Errorf(ErrorWrongRouteDistanceCalculationExpectedNOROUTE)
	}

}

func TestKWLAllRoutes(t *testing.T) {

	// We create a sample Graph
	inputLinks := []KWLLink {"AB5","BC4","CD8","DC8","DE6","AD5","CE2", "EB3","AE7"};
	g := make(KWLGraph)
	error := g.loadGraphLinks(inputLinks)  

	if error != nil {
		t.Errorf(ErrorLoadGraphLinksFailedWithException, error)
	}

	// Test some routes

	routes, _, error := g.allRoutes("C","C", KWLOptions{maxRouteDistance:30, maxRouteLength:4})

	if (error != nil){
		t.Errorf("Failed to find existing routes error: %v", error)
	}

	println(routes)
}


func TestCalculateMinDistance(t *testing.T) {

	test1 := calculateMinDistance(NOROUTE, NOROUTE)

	if (test1 != NOROUTE){
		t.Errorf("result should be NOROUTE")
	}

	test2 := calculateMinDistance(9, NOROUTE)

	if (test2 != 9){
		t.Errorf("result should be 9")
	}

	test3 := calculateMinDistance(NOROUTE, 9)

	if (test3 != 9){
		t.Errorf("result should be 9")
	}

	test4 := calculateMinDistance(15, 9)

	if (test4 != 9){
		t.Errorf("result should be 9")
	}

	test5 := calculateMinDistance(9, 15)

	if (test5 != 9){
		t.Errorf("result should be 9")
	}
}

func TestAllRouteOriginalTestCases(t *testing.T){

	inputLinks := []KWLLink{"AB5", "BC4", "CD8", "DC8", "DE6", "AD5", "CE2", "EB3", "AE7"}
	kiwiland := make(KWLGraph)
	kiwiland.loadGraphLinks(inputLinks)

	// TEST CASE 1 "1. The distance of the route A-B-C. Output #1: 9\n")
	checkDistances(kiwiland.routeDistance("A-B-C"), 9, t )

	// TEST CASE 2 print("2. The distance of the route A-D. Output #2: 5\n")
	checkDistances(kiwiland.routeDistance("A-D"), 5, t )

	// TEST CASE 3 "3. The distance of the route A-D-C. Output #3: 13\n")
	checkDistances(kiwiland.routeDistance("A-D-C"), 13, t )


	// TEST CASE 4 "4. The distance of the route A-E-B-C-D. Output #4: 22\n")
	checkDistances(kiwiland.routeDistance("A-E-B-C-D"), 22, t )

	// TEST CASE 5 "5. The distance of the route A-E-D. Output #5: NO SUCH ROUTE\n")
	checkDistances(kiwiland.routeDistance("A-E-D"), NOROUTE, t )


	// TEST CASE 6. The number of trips starting at C and ending at C with a maximum of 3 stops.
	// In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).\n`)

	allRoutes6, _, _ := kiwiland.allRoutes("C", "C", KWLOptions{maxRouteDistance: 30, maxRouteLength: 4})
	checkNumbers(len(allRoutes6), 2, t)
	checkRoutes(allRoutes6, []KWLRoute{"C-D-C", "C-E-B-C"},t)

	// TEST CASE 7. The number of trips starting at A and ending at C with exactly 4 stops.
	// In the sample data below, there are three such trips: A to C (via B,C,D);
	//	A to C (via D,C,D); and A to C (via D,E,B).`)

	allRoutes7, _, _ := kiwiland.allRoutes("A", "C", KWLOptions{maxRouteDistance: 30, maxRouteLength: 5, minRouteLength: 5})
	checkNumbers(len(allRoutes7), 3,t)
	checkRoutes(allRoutes7, []KWLRoute{"A-B-C-D-C", "A-D-C-D-C", "A-D-E-B-C"},t)

	// TEST CASE`8. The length of the shortest route (in terms of distance to travel) from A
	// to C.Output #8: 9`)
	
	allRoutes8, minDistance8, _ := kiwiland.allRoutes("A", "C", KWLOptions{maxRouteDistance: 30, maxRouteLength: 11})

	checkDistances(minDistance8, 9,t)
	checkRoutes(allRoutes8, []KWLRoute{},t)

	// TEST CASE 9. The length of the shortest route (in terms of distance to travel) from B
	// to B.Output #9: 9`)

	allRoutes9, minDistance9, _ := kiwiland.allRoutes("B", "B", KWLOptions{maxRouteDistance: 30, maxRouteLength: 11})

	checkDistances(minDistance9, 9,t)
	checkRoutes(allRoutes9, []KWLRoute{},t)

	// TEST CASE 10. The number of different routes from C to C with a distance of less than
	// 30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC,
	// CEBCEBC, CEBCEBCEBC.`)

	allRoutes10, _, _ := kiwiland.allRoutes("C", "C", KWLOptions{maxRouteDistance: 29, maxRouteLength: 11})

	checkNumbers(len(allRoutes10), 7,t)
	checkRoutes(allRoutes10, []KWLRoute{"C-D-C", "C-E-B-C", "C-E-B-C-D-C", "C-D-C-E-B-C", "C-D-E-B-C", "C-E-B-C-E-B-C", "C-E-B-C-E-B-C-E-B-C"},t)


}



/* //////////// OLD GO CODE
func TestNewDeck(t *testing.T) {

	d := newDeck()

	if len(d) != 20 {
		t.Errorff("expected 20 gto %v", len(d))
	}
}

func TestSaveAndReadDeck(t *testing.T) {
	const testFile = "_decktesting"
	removeFile(testFile)

	d := newDeck()

	d.saveToFile()

	dd := readFromFile()

	if dd == nil {
		t.Errorff("Could not read file")
	}

}

*/



// UTILITY FUNCTIONS

func checkDistances(response KWLDistance, answer KWLDistance, t *testing.T) {
	if response != answer {
			t.Errorf("result should be %v", answer)
	}
}


func checkNumbers(response int, answer int, t *testing.T) {
	if response != answer {
			t.Errorf("result should be %v", answer)
	}
}

func checkRoutes(response []KWLRoute, answer []KWLRoute, t *testing.T){

	responsemap := make(map[KWLRoute]bool)

	for _, route := range response {
		responsemap[route] = true
	}
	for _, route := range answer {
		if !responsemap[route] {
			t.Errorf("Could not find route %v\n", route)
		}
	}
}
