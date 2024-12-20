'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class courseupload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  courseupload .init({
    user_id: DataTypes.STRING,
    course_title: DataTypes.STRING,
    course_uploadDate: DataTypes.STRING,
    course_fileURL: DataTypes.STRING,
    course_type: DataTypes.STRING,
    course_description: DataTypes.STRING,
    course_url: DataTypes.STRING,
    course_status: DataTypes.STRING,
    course_usertype: DataTypes.STRING,
    course_purchaseId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'courseupload',
  });
  return courseupload ;
};