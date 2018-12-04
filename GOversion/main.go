package main

import "fmt"

/*
The code in this file is to test our code according to the original requirements
I repeat here the 10 test in the requirements using the original test data
and I print the output as pexpected.
Further testing is done in othe test files and can be run using go test
*/

func main() {

	fmt.Println("WIKILAND2GO STARTING")
	inputLinks := []KWLLink{"AB5", "BC4", "CD8", "DC8", "DE6", "AD5", "CE2", "EB3", "AE7"}
	fmt.Println("INPUT GRAPH: ", inputLinks)

	kiwiland := make(KWLGraph)
	kiwiland.loadGraphLinks(inputLinks)

	// TEST CASE 1
	print("1. The distance of the route A-B-C. Output #1: 9\n")
	checkDistanceAndPrint(kiwiland.routeDistance("A-B-C"), 9)

	// TEST CASE 2
	print("2. The distance of the route A-D. Output #2: 5\n")
	checkDistanceAndPrint(kiwiland.routeDistance("A-D"), 5)

	// TEST CASE 3
	print("3. The distance of the route A-D-C. Output #3: 13\n")
	checkDistanceAndPrint(kiwiland.routeDistance("A-D-C"), 13)

	// TEST CASE 4
	print("4. The distance of the route A-E-B-C-D. Output #4: 22\n")
	checkDistanceAndPrint(kiwiland.routeDistance("A-E-B-C-D"), 22)

	// TEST CASE 5
	print("5. The distance of the route A-E-D. Output #5: NO SUCH ROUTE\n")
	checkDistanceAndPrint(kiwiland.routeDistance("A-E-D"), NOROUTE)

	// TEST CASE 6
	print(`6. The number of trips starting at C and ending at C with a maximum of 3 stops.
		In the sample data below, there are two such trips: C-D-C (2 stops). and C-E-B-C (3 stops).\n`)
	allRoutes6, _, _ := kiwiland.allRoutes("C", "C", KWLOptions{maxRouteDistance: 30, maxRouteLength: 4})
	checkNumbersAndPrint(len(allRoutes6), 2)
	checkRoutesAndPrint(allRoutes6, []KWLRoute{"C-D-C", "C-E-B-C"})

	// TEST CASE 7
	println(`7. The number of trips starting at A and ending at C with exactly 4 stops.
		In the sample data below, there are three such trips: A to C (via B,C,D);
		A to C (via D,C,D); and A to C (via D,E,B).`)

	allRoutes7, _, _ := kiwiland.allRoutes("A", "C", KWLOptions{maxRouteDistance: 30, maxRouteLength: 5, minRouteLength: 5})
	checkNumbersAndPrint(len(allRoutes7), 3)
	checkRoutesAndPrint(allRoutes7, []KWLRoute{"A-B-C-D-C", "A-D-C-D-C", "A-D-E-B-C"})

	// TEST CASE 8
	println(`8. The length of the shortest route (in terms of distance to travel) from A
	to C.Output #8: 9`)
	allRoutes8, minDistance8, _ := kiwiland.allRoutes("A", "C", KWLOptions{maxRouteDistance: 30, maxRouteLength: 11})

	checkDistanceAndPrint(minDistance8, 9)
	checkRoutesAndPrint(allRoutes8, []KWLRoute{})

	// TEST CASE 9
	println(`9. The length of the shortest route (in terms of distance to travel) from B
	to B.Output #9: 9`)
	allRoutes9, minDistance9, _ := kiwiland.allRoutes("B", "B", KWLOptions{maxRouteDistance: 30, maxRouteLength: 11})

	checkDistanceAndPrint(minDistance9, 9)
	checkRoutesAndPrint(allRoutes9, []KWLRoute{})

	// TEST CASE 10
	println(`10. The number of different routes from C to C with a distance of less than
	30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC,
	CEBCEBC, CEBCEBCEBC.`)

	allRoutes10, _, _ := kiwiland.allRoutes("C", "C", KWLOptions{maxRouteDistance: 29, maxRouteLength: 11})

	checkNumbersAndPrint(len(allRoutes10), 7)
	checkRoutesAndPrint(allRoutes10, []KWLRoute{"C-D-C", "C-E-B-C", "C-E-B-C-D-C", "C-D-C-E-B-C", "C-D-E-B-C", "C-E-B-C-E-B-C", "C-E-B-C-E-B-C-E-B-C"})

} //END OF MAIN

func checkDistanceAndPrint(response KWLDistance, answer KWLDistance) {
	if response != answer {
		fmt.Printf("Wrong answer, Expected answer got response")
		// panic("Wrong Distance")
	}
	if response != NOROUTE {
		fmt.Printf("The response was %v\n", response)
	} else {
		fmt.Printf("The response was %v\n", NO_SUCH_ROUTE)
	}
}
func checkNumbersAndPrint(response int, answer int) {
	if response != answer {
		panic(`Wrong answer'`)
	}
	fmt.Printf("The response was %v\n", response)
}
func checkRoutesAndPrint(response []KWLRoute, answer []KWLRoute) {

	someRoutesNotFound := false
	responsemap := make(map[KWLRoute]bool)

	for _, route := range response {
		responsemap[route] = true
		println(route)
	}
	for _, route := range answer {
		if !responsemap[route] {
			fmt.Printf("Could not find route %v\n", route)
			someRoutesNotFound = true
		}
	}
	if someRoutesNotFound {
		panic("Not all expected routes where found in response!\n")
	}
	fmt.Printf("OK, All Expected Routes Where Found\n")
}

/*

export function checkRoutesAndPrint(response: Route[], answer: string[]) {

  let routeStrings:string[] =   response.reduce( (acc,r) => [...acc, r.join("")] ,[] )

  let allRoutesDiscovered = answer.every( s => routeStrings.some( r => r==s ) )

  if (!allRoutesDiscovered)
  throw `Not all routes were discovered!`;

  console.log(`All expected routes where found`);
}













// TEST CASE 10
print(`10. The number of different routes from C to C with a distance of less than
30.  In the sample data, the trips are: CDC, CEBC, CEBCDC, CDCEBC, CDEBC,
CEBCEBC, CEBCEBCEBC.`);

const allRoutes10 = kiwiland.allOfRoutesMaximunDistance("C", "C", 29);
checkAndPrint(allRoutes10.length, 7);
printroutes(allRoutes10);
checkRoutesAndPrint(allRoutes10,["CDC", "CEBC", "CEBCDC", "CDCEBC", "CDEBC","CEBCEBC", "CEBCEBCEBC"])

print(`EVERYTHING LOOK GOOD!`);








// UTILITY FUNCTIONS TO PRINT AND CHECK CONDITIONS

export function checkAndPrint(response, answer) {
  if (response != answer)
    throw `Wrong answer, Expected ${answer} got ${response}`;
  console.log(`The response was ${response}`);
}

export function print(o) {
  // print object nice
  console.log("");
  console.log(JSON.stringify(o, null, 2));
}

export function printroutes(routes: Route[]) {
  // print routes array nice
  routes.forEach(r => {
    console.log(JSON.stringify(r.join(""), null, 2));
  });
}

export function checkRoutesAndPrint(response: Route[], answer: string[]) {

  let routeStrings:string[] =   response.reduce( (acc,r) => [...acc, r.join("")] ,[] )

  let allRoutesDiscovered = answer.every( s => routeStrings.some( r => r==s ) )

  if (!allRoutesDiscovered)
  throw `Not all routes were discovered!`;

  console.log(`All expected routes where found`);
}



*/
////////////////////////////////// OLD GO CODE

/*
	//var card string = "Ace of Spades"
	cards := newDeck()
	cards = append(cards, "Six of Space")


	d1, d2 := cards.deal(3)

	d1.print()
	d2.print()

	d1.saveToFile()

	fmt.Println(d1.toString())

	dd := readFromFile()

	dd.print()
*/
