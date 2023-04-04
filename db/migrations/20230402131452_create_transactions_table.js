/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('transactions', function (table) {
            table.increments('id');
            table.integer('user_id').unsigned().notNullable();
            table.enum('transaction_type', ['funding', 'transfer_credit', 'transfer_debit', 'withdrawal']);
            table.decimal('amount').defaultTo(0.0);
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
exports.down = function (knex) {
    return knex.schema
        .dropTable('transactions');
};
