"use strict";
/*

The code in this file will keep testing our code according to the original requirements
However, the idea here is to go beyond and test and compare performance.
The code will also change during the performance inprovements,
this is why the folder contains a new copy of the code.

*/
Object.defineProperty(exports, "__esModule", { value: true });
// The next two lines are specifying which version of the code to run
// and also large is the maxLength to test performance/scalability
// this two parameters should come from command line... 
var kiwiland4_1 = require("./kiwiland4");
var testsCases = [45];
var Memory = /** @class */ (function () {
    function Memory() {
    }
    return Memory;
}());
// performance log
var MAXNUMBER = 9007199254740991;
var LogRecord = /** @class */ (function () {
    function LogRecord() {
    }
    return LogRecord;
}());
var globalLog = [];
function logTimeAndMemory(tag1, tag2, log) {
    if (tag1 === void 0) { tag1 = ""; }
    if (tag2 === void 0) { tag2 = ""; }
    if (log === void 0) { log = globalLog; }
    var logRecord = new LogRecord();
    logRecord.time = Date.now();
    logRecord.mem = process.memoryUsage();
    logRecord.tag1 = tag1;
    logRecord.tag2 = tag2;
    if (log.length > 0) {
        var prevLogRecord = log[log.length - 1];
        logRecord.time_diff = logRecord.time - prevLogRecord.time;
        logRecord.mem_diff = new Memory();
        logRecord.mem_diff.external =
            logRecord.mem.external - prevLogRecord.mem.external;
        logRecord.mem_diff.heapTotal =
            logRecord.mem.heapTotal - prevLogRecord.mem.heapTotal;
        logRecord.mem_diff.heapUsed =
            logRecord.mem.heapUsed - prevLogRecord.mem.heapUsed;
        logRecord.mem_diff.rss = logRecord.mem.rss - prevLogRecord.mem.rss;
    }
    log.push(logRecord);
}
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
// Declaring testing objects and loading data
var kiwiland = new kiwiland4_1.Kiwiland(); // CREATE THE GRAPH
kiwiland.loadGraphLinks(inputLinks); // LOAD THE TESTING DATA
// TESTING PERFORMANCE
for (var _i = 0, testsCases_1 = testsCases; _i < testsCases_1.length; _i++) {
    var testMaxLength = testsCases_1[_i];
    print("testMaxLength :" + testMaxLength);
    logTimeAndMemory("test" + testMaxLength, "start");
    var result = kiwiland.allRoutesRecursive("C", "C", MAXNUMBER, testMaxLength);
    logTimeAndMemory("test" + testMaxLength, "end");
    print(result.length);
    print_last_log();
}
// REGRESION TESTS
// TEST CASE 1
print("1. The distance of the route A-B-C. Output #1: 9.....");
checkAndPrint(kiwiland.routeDistance("ABC"), 9);
// TEST CASE 2
print("2. The distance of the route A-D. Output #2: 5");
checkAndPrint(kiwiland.routeDistance("AD"), 5);
// TEST CASE 3
print("3. The distance of the route A-D-C. Output #3: 13");
checkAndPrint(kiwiland.routeDistance("ADC"), 13);
// TEST CASE 4
print("4. The distance of the route A-E-B-C-D. Output #4: 22");
checkAndPrint(kiwiland.routeDistance("AEBCD"), 22);
// TEST CASE 5
print("5. The distance of the route A-E-D. Output #5: NO SUCH ROUTE");
checkAndPrint(kiwiland.routeDistance("AED"), kiwiland4_1.NOROUTE);
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
    routes.forEach(function (r) {
        console.log(r);
    });
}
exports.printroutes = printroutes;
function checkRoutesAndPrint(response, answer) {
    var allRoutesDiscovered = answer.every(function (s) { return response.some(function (r) { return r == s; }); });
    if (!allRoutesDiscovered)
        throw "Not all routes were discovered!";
    console.log("All expected routes where found");
}
exports.checkRoutesAndPrint = checkRoutesAndPrint;
function print_last_log() {
    var lastLog = globalLog[globalLog.length - 1];
    console.log("time_diff: " + lastLog.time_diff + "   heap_size: " + lastLog.mem.heapUsed + " ");
}
//# sourceMappingURL=kiwiland4_test.js.map