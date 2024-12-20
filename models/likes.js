'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bo_likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bo_likes.init({
    user_id: DataTypes.STRING,
    comment_id: DataTypes.STRING,
    isLike: DataTypes.STRING,
    isDislike: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bo_likes',
  });
  return bo_likes;
};