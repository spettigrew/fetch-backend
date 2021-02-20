exports.seed = async (knex) => {
  await knex("transactions").truncate()
}