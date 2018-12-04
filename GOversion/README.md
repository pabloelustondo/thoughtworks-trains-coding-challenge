This folder contains a GO solution for the problem described and implemented in Node.js in the root folder. 
Besides using GO, this version has a reasonable test coverage almost 90% and uses the GO testing framework.
Also, I put more attention to handle error conditions and test them.
And the primary function, called "allRoutes" now does all the work recursively without the need for extra steps to deliver de results needed for the specified tests.

the file main.go  runs the original tests and prints the results.
the file kiwiland.go is where the main implementation is done.
the file kiwiland_test.go is where the uniut tests are.
other files are for contants, messages ,etc. 

Please, read the previous README for more details
I suggest you run/explore this code using VSCode. Easy.
If you want to use the command line here we go:


TO RUN ===> go run main.go kiwiland.go kiwiland_messages.go kiwiland_errors.go kiwiland_constants.go

TO TEST  ===> go test


Of course, I am assuming you have GO installed :).
