'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class courses_syllabus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  courses_syllabus.init({
    course_id: DataTypes.INTEGER,
    syllabus_title: DataTypes.STRING,
    week: DataTypes.STRING,
    no_of_modules: DataTypes.INTEGER,
    no_skills: DataTypes.INTEGER,
    course_content: DataTypes.TEXT,
    content_preview_video: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'courses_syllabus',
  });
  return courses_syllabus;
};