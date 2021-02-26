
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('transactions').insert([
    { user_id: 1, payer_name: "DANNON", points: 1000, timestamp: new Date() },
    { user_id: 1, payer_name: "UNILEVER", points: 200, timestamp: new Date() },
    { user_id: 1, payer_name: "DANNON", points: -200, timestamp: new Date() },
    { user_id: 1, payer_name: "MILLER COORS", points: 10000, timestamp: new Date() },
    { user_id: 1, payer_name: "DANNON", points: 300, timestamp: new Date() }
  ])
};
