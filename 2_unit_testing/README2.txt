README
	This readme contains information regarding frontend and backend unit testing


FRONTEND
For the frontend, we used Jest, a well known Javascript testing framework, along with Enzyme, which is a testing utility that works with Jest to test React components.

To run these tests, simply `cd ../1_code/frontend/src` and run `jest`. If you would like to see test coverage, simply run the previous command with the `--coverage` flag.


BACKEND
Since our group is using Jest and Supertest, we found it much easier to write our backend unit tests and integration tests together. Jest and Supertest allows us to create testing suites with multiple test cases inside.

In this manner, each individual test within the suite can serve as our unit tests, since we can see exactly which test case fails. Through this failure, we easily identify which of our modules is failing. Additionally, the whole *.test.js file serves as our integration testing because multiple modules are tested.

Please see ../3_integration_testing/README3.txt for more information about running our testing. 
Additionally, you may click the symlinks in this folder to be redirected to the directory containing the integration testing source code.
	../1_code/app/services/league/tests/
	../1_code/app/services/stock/tests/


AUTHORS
	(Refer to ../1_code/README1.txt)