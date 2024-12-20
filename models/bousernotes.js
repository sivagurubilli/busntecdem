'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bousernotes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bousernotes.init({
    uuid:{
        type: DataTypes.STRING
    },
    user_id:{
        type: DataTypes.STRING
    },
    course_id:{
      type:DataTypes.STRING
    },
    section_name:{
        type: DataTypes.STRING
    },
    video_title:{
        type: DataTypes.STRING
    },
    note:{
        type: DataTypes.STRING
    },
    timestamp:{
        type: DataTypes.STRING
    },
    status:{
        type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'bousernotes',
  });
  return bousernotes;
};