README
	This readme contains information regarding necessary data collection

DATA COLLECTION
    The stock service requires a list of tracked equity tickers for fast response times.
    This list can be populated by running the populateTickers.js script one time.

PREREQUISITES
    Configure the .env file with the mongodb database url. Refer to the original README if you do not have a database.
    Create the .env file in the following location:
        ./app/services/stock/.env
    Set DB_URL to the database url.
    Ensure that the correct versions of Node Package Manager and Node.js are installed, as per the original README.
    Ensure that the packages have been installed, as defined in package.json.

RUN
    Navigate to ./app/services/stock/scripts
    Run "node populateTickers"
    This script will populate the "tickers" collection in the MongoDB database.
    When completed, there should be approximately 10,300 documents in the collection.

AUTHORS
	(Refer to ../1_code/README1.txt)