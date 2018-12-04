package main

// ErrorInputLinksMustHave3Characters links must to have exactly 3 characters. i.e AB5
const ErrorInputLinksMustHave3Characters = "links mus have exactly 3 characters. i.e AB5"
// ErrorInputLinkLastCharacterMustBeNumber Error Input Link Last Character Must Be a Number
const ErrorInputLinkLastCharacterMustBeNumber = "strconv.Atoi: parsing \"C\": invalid syntax"
// ErrorLoadGraphLinksFailedWithException Error AddLinks Failed With Exception
const ErrorLoadGraphLinksFailedWithException = "loadGraphLinksfailed with error %v"
// ErrorLoadGraphLinksWrongDistance wrong distance LINK DISTANCE"
const ErrorLoadGraphLinksWrongDistance = "loadGraphLinksfailed wrong distance %v %v"
// ErrorWrongRouteDistanceCalculationNOROUTE Route distance found is NOROUTE when it should be a number
const ErrorWrongRouteDistanceCalculationNOROUTE = "Route distance found is NOROUTE when it should be a number"
// ErrorWrongRouteDistanceCalculation Route distance found is incorrect
const ErrorWrongRouteDistanceCalculation = "Route distance found is incorrect"
// ErrorWrongRouteDistanceCalculationExpectedNOROUTE "Route distance found but NOROUTE was expected"
const ErrorWrongRouteDistanceCalculationExpectedNOROUTE = "Route distance found but NOROUTE was expected"