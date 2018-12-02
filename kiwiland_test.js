"use strict";
/*

The code in this file is to test our code according to the original requirements
We exactly repeast here the 10 test in the requirements and one set of input data.
Further testing is done in other files.

*/
Object.defineProperty(exports, "__esModule", { value: true });
var kiwiland_1 = require("./kiwiland");
// INPUT DATA 
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
// TESTS
var kiwiland = new kiwiland_1.Kiwiland(); // CREATE THE GRAPH
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
checkAndPrint(kiwiland.routeDistance(["A", "E", "D"]), kiwiland_1.NOROUTE);
// TEST CASE 6
print("6. The number of trips starting at C and ending at C with a maximum of 3\nstops.  In the sample data below, there are two such trips: C-D-C (2\nstops). and C-E-B-C (3 stops).");
var allRoutes6 = kiwiland.allRoutesForAMaximunNumberOfStops("C", "C", 3);
checkAndPrint(allRoutes6.length, 2);
printroutes(allRoutes6);
checkRoutesAndPrint(allRoutes6, ["CDC", "CEBC"]);
// TEST CASE 7
print("7. The number of trips starting at A and ending at C with exactly 4 stops.\nIn the sample data below, there are three such trips: A to C (via B,C,D); A\nto C (via D,C,D); and A to C (via D,E,B).");
var allRoutes7 = kiwiland.allRoutesForANumberOfStops("A", "C", 4);
checkAndPrint(allRoutes7.length, 3);
printroutes(allRoutes7);
checkRoutesAndPrint(allRoutes7, ["ABCDC", "ADCDC", "ADEBC"]);
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
checkRoutesAndPrint(allRoutes10, ["CDC", "CEBC", "CEBCDC", "CDCEBC", "CDEBC", "CEBCEBC", "CEBCEBCEBC"]);
print("EVERYTHING LOOK GOOD!");
// UTILITY FUNCTIONS TO PRINT AND CHECK CONDITIONS
function checkAndPrint(response, answer) {
    if (response != answer)
        throw "Wrong answer, Expected " + answer + " got " + response;
    console.log("The response was " + response);
}
exports.checkAndPrint = checkAndPrint;
function print(o) {
    // print object nice
    console.log("");
    console.log(JSON.stringify(o, null, 2));
}
exports.print = print;
function printroutes(routes) {
    // print routes array nice
    routes.forEach(function (r) {
        console.log(JSON.stringify(r.join(""), null, 2));
    });
}
exports.printroutes = printroutes;
function checkRoutesAndPrint(response, answer) {
    var routeStrings = response.reduce(function (acc, r) { return acc.concat([r.join("")]); }, []);
    var allRoutesDiscovered = answer.every(function (s) { return routeStrings.some(function (r) { return r == s; }); });
    if (!allRoutesDiscovered)
        throw "Not all routes were discovered!";
    console.log("All expected routes where found");
}
exports.checkRoutesAndPrint = checkRoutesAndPrint;
//# sourceMappingURL=kiwiland_test.js.map