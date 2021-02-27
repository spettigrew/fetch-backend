const db = require("../db-config")

const getAll = async () => {
    return await db("transactions")
    .select("*")
}

function getBalance() {
    return db("transactions")
    .select("payer_name")
    .sum("points as points")
    .groupBy("payer_name")
}

async function getTotalBalance() {
   return db("transactions")
   .sum("points as points")
}

const createTransaction = async (data) => {
    if (data.points < 0) {
        // get the current balance of the data.payer_name
        const [currentBalance] = await db("transactions")
            .where("payer_name", data.payer_name)
            .sum("points as points")
        const difference = currentBalance.points - Math.abs(data.points)
        // check if the current balance - the points is >= 0
        if (currentBalance.points - data.points >= 0) {

            const transaction = {
                ...data,
                timestamp: new Date(),
            }
            // if so, insert the transaction
            const [id] = await db("transactions")
            .insert(transaction)
            return await db("transactions")
            .where({ id })
        }
        // if not, throw an error
        if (Error.transaction) {
            Error.transaction(err)
        }
    } else {
        const transaction = {
            ...data,
            timestamp: new Date(),
        }
        // if so, insert the transaction
        const [id] = await db("transactions")
        .insert(transaction)
        return await db ('transactions')
        .where({ id })
    }
    }

    const spendPoints = async (points) => {
        let spendingPoints = points
        const spendLog = []
        // check if user still has points to spend
        const [totalBalance]  = await getTotalBalance()
        if (totalBalance.points - points >= 0) {
            const orderedTransactions = await db('transactions')
            .orderBy('timestamp')

        for (let index = 0; index < orderedTransactions.length; index++) {
            const transaction = orderedTransactions[index];
            // if points are available, spend the points
            if (transaction.points > points) {
                const newTransaction = {
                    payer_name: transaction.payer_name,
                    user_id: transaction.user_id,
                    points: -Math.abs(spendingPoints),
                    timestamp: new Date()
                } 
                const [id] = await db("transactions")
                .insert(newTransaction)
                const spent = await db("transactions")
                .where({ id })
                .select('payer_name', 'points')
                spendLog.push(spent)
                console.log(spent);
                // return spendLog


            } 
            // else {
                // const payerTotal = await db('transactions')
                // .where('payer_name', transaction.payer_name)
                // .sum('points as points')
                // if (payerTotal > spendingPoints) {
                //     const newTransaction = {
                //         payer_name: transaction.payer_name,
                //         user_id: transaction.user_id,
                //         timestamp: new Date(),
                //         points: -Math.abs(spendingPoints)
                //     }
                //     const spent = await db('transactions')
                //     .insert(newTransaction)
                //     .select('payer_name', 'points')
                //     spendLog.push(spent)
                //         return spendLog
            // }  
            // else {
                // const partialSpend = transaction.points
                // spendingPoints -= partialSpend
                // const newTransaction = {
                //     payer_name: transaction.payer_name,
                //     user_id: transaction.user_id,
                //     timestamp: new Date(),
                //     points: -Math.abs(partialSpend) 
                // }
                // const spent = await db('transactions').insert(newTransaction).select('payer_name', 'points')
                // spendLog.push(spent)
            // }
            // }
            }
        }
        return spendLog
    }

module.exports = {
    getAll,
    getBalance,
    getTotalBalance,
    createTransaction,
    spendPoints,
}

// async function getTotalBalance(user_id, payer_name) {
//     return db("transactions")
//         .where({ user_id })
//         .select(payer_name)
//         .sum("points as points")
//         .groupBy('payer_name')
// }

// async function createTransaction(user_id, payer_name, timestamp) {
//     return db("transactions")
//         .where({ user_id })
//         .insert(timestamp)
//         .groupBy(payer_name)
// }

// async function spendPoints(payer_name, timestamp) {
//     return db("transactions")
//         .update(timestamp)
//         .groupBy(payer_name)
// }