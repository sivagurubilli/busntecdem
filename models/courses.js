'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class courses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  courses.init({
    business_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    course_name: DataTypes.STRING,
    course_description: DataTypes.TEXT,
    course_preview_video: DataTypes.TEXT,
    course_status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'courses',
  });
  return courses;
};