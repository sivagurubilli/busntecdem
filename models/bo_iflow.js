'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class userFlow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userFlow.init(
    {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: uuidv4(),
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: '',
      },

      user_id: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      flow_data: {
        type: DataTypes.TEXT,
        defaultValue: '',
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: '1',
      },
    },
    {
      sequelize,
      modelName: 'userFlow',
      tableName: 'bo_user_flow',
    }
  );

  // userFlow.sync()
  // userFlow.sync({ alter: true });

  return userFlow;
};
