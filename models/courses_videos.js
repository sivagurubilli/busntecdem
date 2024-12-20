'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class courses_videos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  courses_videos.init({
    course_id: DataTypes.INTEGER,
    video_title: DataTypes.TEXT,
    video_url: DataTypes.TEXT,
    video_duration: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'courses_videos',
  });
  return courses_videos;
};