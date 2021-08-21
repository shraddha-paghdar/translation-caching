# Translation Caching

## Setup Server
1. Install node.js
2. Clone the git repository
3. Install the node modules by typing `npm i`
4. Run the command `npm run debug`
5. goto browser and open 
    http://localhost:3000

## Database setup
1. After starting the server, connect the mysql database
2. Update the credentials in `.env` file
3. goto browser and open 
    http://localhost:3000/syncDb this will create the table and seed the language table

## Design decisions
I have created two tables in database
1. Translation: This table stores the translations performed by the google translate API
2. Language: This table stores the language supported by the google translate API & related language is json field which stores the array of language user usually search in combination with given source language
3. Count variable is used inside relatedlanguage array to sort the language & only fetch top 5 search results

