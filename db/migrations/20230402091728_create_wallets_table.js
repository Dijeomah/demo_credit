/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('wallets', function (table) {
            table.increments('id');
            table.integer('user_id').unsigned().notNullable();
            table.decimal('main_balance').defaultTo(0.0);
            table.decimal('prev_balance').defaultTo(0.0);
            table.timestamps();

            table.foreign('user_id').references('id').inTable('users');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('wallets');
};
