'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coursedetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  coursedetails.init({
    course_details: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'coursedetails',
  });
  return coursedetails;
};