'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class boreply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  boreply.init({
    user_id: DataTypes.STRING,
    uuid: DataTypes.STRING,
    comment_id: DataTypes.STRING,
    reply_comment: DataTypes.TEXT,
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: '1'
    }
  }, {
    sequelize,
    modelName: 'boreply',
  });
  // boreply.sync({alter : true})
  return boreply;
};