const express = require('express');

const transactionsRouter = require('./transactions/transactions-router');

require('dotenv').config()

const server = express();

server.use(express.json());

server.use('/api/transactions', transactionsRouter);

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something is wrong, check again.", err
    })
})

module.exports = server;