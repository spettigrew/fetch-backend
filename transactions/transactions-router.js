const express = require("express")
const db = require("../db-config")

const Transactions = require("./transactions-model")

const router = express.Router()

router.get("/balances", async (req, res, next) => {
    try {
        return res.json(await Transactions.getBalance())
    }
    catch (err) {
        next(err)
    }
})


router.post("/", async (req, res, next) => {
    try {
        return res.json(await Transactions.createTransaction(req.body))
    }
    catch (err) {
        next(err)
    }
})

router.put("/spend-points", async (req, res, next) => {
 try {
    const { points } = req.body
    const result = await Transactions.spendPoints(points)
    res.status(200).json(result)

    } catch (err) {
            next(err)
        }
    }) 
module.exports = router



// async function put(req, res, next) {
//     try {
//         let employee = getEmployeeFromRec(req);

//         employee.employee_id = parseInt(req.params.id, 10);

//         employee = await employees.update(employee);

//         if (employee !== null) {
//             res.status(200).json(employee);
//         } else {
//             res.status(404).end();
//         }
//     } catch (err) {
//         next(err);
//     }
// }