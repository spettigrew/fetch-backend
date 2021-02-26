const db = require("../db-config")

function getBalance() {
    return db("transactions").select("payer_name").sum("points as points").groupBy("payer_name")
}

const getTotalBalance = async () => {
   return db("transactions").sum("points as points")
}

const createTransaction = async (data) => {
    if (data.points < 0) {
        // get the current balance of the data.payer_name
        const [currentBalance] = await db("transactions")
            .where("payer_name", data.payer_name)
            .sum("points as points")
        // console.log(currentBalance.points);
        // console.log(data.points);
        const difference = currentBalance.points - Math.abs(data.points)
        console.log(Math.abs(data.points));
        // check if the current balance - the points is >= 0
        if (currentBalance.points - data.points >= 0) {

            const transaction = {
                ...data,
                timestamp: new Date(),
            }
            // if so, insert the transaction
            return db("transactions").insert(transaction).returning("*")
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
        return db("transactions").insert(transaction).returning("*")
    }

    }

    const spendPoints = async (points) => {
        let spendingPoints = points
        const spendLog = []
        const [totalBalance]  = await getTotalBalance()
        console.log(points);
        if (totalBalance.points - points >= 0) {
            const orderedTransactions = await db('transactions').orderBy('timestamp')

        for (let index = 0; index < orderedTransactions.length; index++) {
            console.log(spendLog);
            const transaction = orderedTransactions[index];
            if (transaction.points > points) {
                const newTransaction = {
                    payer_name: transaction.payer_name,
                    user_id: transaction.user_id,
                    timestamp: new Date(),
                    points: -Math.abs(spendingPoints) 
                } 
                const spent = await db('transactions').insert(newTransaction).returning('payer_name', 'points')
                spendLog.push(spent)


            } else {
                const payerTotal = await db('transactions')
                .where('payer_name', transaction.payer_name)
                .sum('points as points')
                if (payerTotal > spendingPoints) {
                    const newTransaction = {
                        payer_name: transaction.payer_name,
                        user_id: transaction.user_id,
                        timestamp: new Date(),
                        points: -Math.abs(spendingPoints)
                    }
                    const spent = await db('transactions').insert(newTransaction).returning('payer_name', 'points')
                    spendLog.push(spent)
  
                   
            }  else {
                const partialSpend = transaction.points
                spendingPoints -= partialSpend
                const newTransaction = {
                    payer_name: transaction.payer_name,
                    user_id: transaction.user_id,
                    timestamp: new Date(),
                    points: -Math.abs(partialSpend) 
                }
                const spent = await db('transactions').insert(newTransaction).returning('payer_name', 'points')
                spendLog.push(spent)
            }


            }
            }
        }
        return spendLog
    }


module.exports = {
    getBalance,
    createTransaction,
    spendPoints,
}