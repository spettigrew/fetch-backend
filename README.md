# fetch-backend
Fetch Rewards Coding Exercise - Backend Software Engineering


### Notes for Installations for backend. ###

- Go to nodejs.org -- install on your PC
- npm init

- npx install dotenv,
                knex, 
                express

- npm install --save dev
- npx knex init 

    *(configure under scripts in package.json)
     "server": "nodemon index.js",
     "start": "nodemon index.js"

- setup: server.js, index.js, db.config.js files and .env file.

    *index.js
        const server = require('./server.js');

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});

    *server.js
        const express = require('express');

        const router = require('./('filename')/('file-router'));

require('dotenv').config()

const server = express();

server.use(express.json());
server.use('/api/', );

server.get("/", (req, res, next) => {
    res.send("<h4>I am your sanity check. Hello!</h4>")
})

module.exports = server;

    *.env   
        PORT = 4000

knex migrations;
- npx knex migrate:make <filename>
- knex migrate:latest
- knex seed:make 000-cleanup.js 
- knex seed:make 00(consecutive number) <filename>
- knex seed:run
 
    ##### npm run server