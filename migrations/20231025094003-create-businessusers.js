'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('businessusers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull:false
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue:true
      },
      is_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      mobile_number: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      roles: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      password: {
        type: Sequelize.STRING
      },
      has_password: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      profile_url: {
        type: Sequelize.STRING
      },
      email_verify_token: {
        type: Sequelize.STRING
      },
      change_password_token: {
        type: Sequelize.STRING
      },
      login_type: {
        type: Sequelize.STRING
      },
      provider_token: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('businessusers');
  }
};