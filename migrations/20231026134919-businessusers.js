'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  await queryInterface.addColumn('businessusers', 'bus_acnt_name', Sequelize.STRING);
  // await queryInterface.addColumn('businessusers', 'bus_email', Sequelize.STRING);
  await queryInterface.addColumn('businessusers', 'city', Sequelize.STRING);
  await queryInterface.addColumn('businessusers', 'state', Sequelize.STRING);
  await queryInterface.addColumn('businessusers', 'country', Sequelize.STRING);
  await queryInterface.renameColumn('businessusers','email_id','bus_email')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
