/*

The code in this file is to test our code according to the original requirements
We exactly repeast here the 10 test in the requirements and one set of input data.
Further testing is done in other files.

*/

import { Kiwiland, InputLink , Route, NOROUTE } from './kiwiland'


// INPUT DATA 

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

// TESTS

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
    console.log(JSON.stringify(r.join(), null, 2));
  });
}


