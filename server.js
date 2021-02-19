const express = require('express');

const payerRouter = require('./payers/payer-router');
const pointsRouter = require('./points/points-router');
const timestampRouter = require('./timestamps/timestamp-router');
const pointstampRouter = require('./points-stamps/pointstamp-router');

require('dotenv').config()

const server = express();

server.use(express.json());

server.use('/api/payers', payerRouter);
server.use('/api/points', pointsRouter);
server.use('/api/timestamps', timestampRouter);
server.use('/api/points-stamps', pointstampRouter);

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something is wrong, check again.", err
    })
})

module.exports = server;