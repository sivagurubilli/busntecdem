'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses_syllabuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      course_id: {
        type: Sequelize.INTEGER
      },
      syllabus_title: {
        type: Sequelize.STRING
      },
      week: {
        type: Sequelize.STRING
      },
      no_of_modules: {
        type: Sequelize.INTEGER
      },
      no_skills: {
        type: Sequelize.INTEGER
      },
      course_content: {
        type: Sequelize.TEXT
      },
      content_preview_video: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('courses_syllabuses');
  }
};