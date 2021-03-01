const express = require("express")
const db = require("../db-config")

const Transactions = require("./transactions-model")

const router = express.Router()

router.get("/balances", async (req, res, next) => {
    try {
        const result = await Transactions.getBalance()
        if (result) {
            res.status(200).json(result)
        }
    }
    catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    try { 
        const result = await Transactions.createTransaction(req.body)
        if (!result.error) {
            res.statusCode(400).json({message: result.error})
        }
    }
    catch (err) {
        next(err)
    }
})

router.get('/', async ( req, res, next ) => {
    try {
        const result = await Transactions.getAll()
        if (result) {
            res.status(200).json(result)
        }
    } catch (err) {
        next(err)
    }
})

router.put("/spend-points", async (req, res, next) => {
 try {
    const { points } = req.body
    const result = await Transactions.spendPoints(points)
    if (!result.error) {
        res.status(200).json(result)
    } else {
        res.status(200).json({message: result.error})
    }

    } catch (err) {
            next(err)
        }
    }) 

module.exports = router