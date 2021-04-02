README
	Our group is creating a web application using a MERN stack (Mongoose, Express, React, and Node). The application will be a virtual stock market investment fantasy league, where users will be able to invest in virtual portfolios and compete against other players. The application also provides a wealth of information to help new investors familiarize themselves with the stock market.


AUTHORS
	Aarushi Pandey
	Aarushi Satish
	Apoorva Goel
	Christine Mathews
	David Lau
	Jacques Scheire
	Jawad Jamal
	Krishna Prajapati
	Riya Tayal
	Sahitya Gande
	Yati Patel
	Yatri Patel


THANKS
	Special thanks to Professor Ivan Marsic and his TA's for teaching us the principles of good software engineering and for helping guide part of our development through their advice and critiques


INSTALL
	Install Node Package Manager (npm version 7.5.4)
	Install Node.js (node version 15.9.0)
	Open a terminal. CD to each directory below and run the "npm install" inside
		./frontend
		./app/services/league
		./app/services/stock
		
		This will install all dependencies for the project
		If a dependency error is encountered while installing, run the following command
			"npm install --legacy-peer-deps"

	Create an account on https://www.mongodb.com/ and create a database
	Follow the instructions for creating/connecting a database to the application
		When asked to choose connection method, pick "Connect your application"
		Copy the given string

	Set DB_URL in the following .env files to be equal to the string copied from MongoDB
		./app/services/league/.env
		./app/services/stock/.env
		Make sure the "Include full driver code" box is NOT checked
		Remember to change the username and password of the copied string

	Create an account on https://iexcloud.io/
	Sign in and copy your API key
	Set API_KEY in ./app/services/stock/.env to be equal to the copied API Key

	
	CHANGING PORTS (optional)
		To change the league service port, edit the following lines:
			(Let #### be the desired new port)
			In ./app/services/league/.env, change "PORT=####"
			In ./frontend/.env, change "REACT_APP_API_URL= http://localhost:####"

		To change the stock service port, edit the following lines:
			(Let #### be the desired new port)
			In ./app/services/stock/.env, change "PORT=####"
			In ./frontend/.env, change "REACT_APP_API_URL_STOCK= http://localhost:####"


RUN
	Make sure to follow the instructions in INSTALL before running
	
	Open the ./frontend directory in a terminal, run the "npm start" command
		This will locally run the frontend of the application

	In a separate terminal, open the app/service/league directory
	Run "node index"
		This will locally run the league service backend
	
	In a separate terminal, open the app/service/stock directory
	Run "node index"
		This will locally run the stock service backend

	You may now perform any avaliable action on the frontend browser