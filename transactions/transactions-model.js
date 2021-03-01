const db = require("../db-config")

// get all the payers transactions
const getAll = async () => {
    return await db("transactions")
    .select("*")
}

// get the balances of the payers point balance
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

const getPayersBalance = async (payer) => {
    return db('transactions')
    .where(({payer}))
    .sum('points as points')
    .select('payer')
}

const createTransaction = async (data) => {
    // if transaction has points to spend
    if (data.points < 0) {
        // check that the transaction will not create payers balance to go negative
        const [payerBal] = await getPayersBalance(data.payer);
        if (payerBal.points >= Math.abs(data.points)) {
            const transaction = {
                ...data,
            };
            const [id] = await db("transactions")
                .insert(transaction);
            return db('transactions')
                .where({ id });
        } else {
            return { error: 'Insufficient Points' };
        }
    } else {
        // transaction is adding points
        const transaction = {
            ...data,
        };
        const [id] = await db("transactions")
            .insert(transaction);
        return db('transactions')
            .where({ id });
    }
};

const getOrderedTransactions = async () => {
    return db('transactions')
        .orderBy('timestamp');
};

const createNewSpend = (payer, hash) => {
    if (!hash[payer]) {
        hash[payer] = 0;
    }
};


// ! RULES FOR SPENDING POINTS:
// ● We want the oldest points to be spent first (oldest based on transaction
// timestamp, not the order they’re received)
// ● We want no payer's points to go negative.
const spendPoints = async (pointsToSpend) => {
    // var to hold points that can be mutated
    let spendingPoints = pointsToSpend;
    // var where spends will be recorded
    const spendLog = [];
    // check if user still has points to spend if not send error
    const [totalBalance] = await getTotalBalance();
    const difference = totalBalance.points - spendingPoints;
    if (difference < 0) {
        return { error: 'Insufficient Points' };
    }
    // order the transactions by timestamp
    const orderedTransactions = await getOrderedTransactions();
    // var to keep track of spends
    let spends = {};
    // var to keep track of payers balances
    let balances = {};
    // loop over transactions from oldest to newest


    for (let index = 0; index < orderedTransactions.length; index++) {
        const transaction = orderedTransactions[index];
        const { payer, points } = transaction;
        // get current payers balance unaltered
        const [payersBalance] = await getPayersBalance(payer);
        // if we have not seen this payer yet add it to the balances obj
        if (!balances[payer]) {
            balances[payer] = payersBalance.points;
        }
        // if there are points to spend
        if (spendingPoints) {
            // if the current transaction is positive
            if (points > 0) {
                //  if the current payer has balance points to spend
                if (balances[payer] > 0) {
                    const totalSpendablePoints = balances[payer];
                    // if the current transaction is less or equal to all points to
                    // spend
                    if (points <= spendingPoints) {
                        //  spend all spendable points transaction if total spendable
                        //  points is less than points use that.. else use points
                        // if we have not seen this payer yet add it to the spends obj
                        if (!spends[payer]) {
                            spends[payer] = 0;
                        }
                        spends[payer] += points;
                        //  deduct spent points from spending points
                        spendingPoints -= points;
                        //  update the balance to reflect the spend
                        balances[payer] -= spends[payer];
                    } else {
                        //  if the current transaction is more than all points to spend
                        //  spend all points left to spend
                        // if we have not seen this payer yet add it to the spends obj
                        if (!spends[payer]) {
                            spends[payer] = 0;
                        }
                        // spend all points available to spend up to spending points
                        const spending = Math.min(totalSpendablePoints, spendingPoints);
                        spends[payer] += spending;
                        //  update the balance to reflect the spend
                        balances[payer] -= spending;
                        //  deduct spent points from spending points
                        spendingPoints -= spending;
                    }
                }
            } else {
                //  if the current transaction is negative
                // if this payer has spent points already
                if (spends[payer]) {

                    // can we put the whole amount in without exceeding points to spend AND without exceeding points already spent by payer 
                    // if so return the whole amount

                    const overPoints = (Math.abs(points) + spendingPoints) - pointsToSpend;
                    const underSpends = spends[payer] + points;
                    // 1. if removing entire points will exceed points to spend
                    // AND will exceed points already spent
                    if (overPoints > 0 && underSpends < 0) {

                        // go with the minimum between safeAddition and safeDeduction
                        const safe = Math.min(overPoints, underSpends);
                        spends[payer] -= safe;
                        balances[payer] -= safe;
                        spendingPoints += safe;
                        // 2. if removing entire points will NOT exceed points to spend
                        // AND will exceed points already spent
                    } else if (overPoints <= 0 && underSpends < 0) {

                        // it is only safe to remove what has already been spent
                        const safe = spends[payer];
                        spends[payer] -= safe;
                        balances[payer] += safe;
                        spendingPoints += safe;
                        // 3. if the points are already safe to spend
                    } else {
                        spends[payer] += points;
                        balances[payer] += Math.abs(points);
                        spendingPoints += Math.abs(points);
                    }
                }
            }
        }
    }
    for (const payer in spends) {
        const newSpend = {
            payer: payer,
            points: -Math.abs(spends[payer]),
            user_id: 1,
        };
        const [id] = await createTransaction(newSpend);
        spendLog.push({ payer: payer, points: -Math.abs(spends[payer]) });
    }
    return spendLog;
};

module.exports = {
    getAll,
    getBalance,
    getTotalBalance,
    getPayersBalance,
    createTransaction,
    getOrderedTransactions,
    spendPoints,
}

