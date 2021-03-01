
exports.up = async function (knex) {
  await knex.schema.createTable('transactions', (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable()
      table.string('payer_name').notNullable()
      table.integer('points')
      table.datetime('timestamp').notNullable().defaultTo(new Date())
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('transactions')
};
