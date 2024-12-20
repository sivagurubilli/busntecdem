'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class community_joiner extends Model {
  
    static associate(models) {
    }
  }
  community_joiner.init({
    email: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull:false
      },
    consent:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
    },
    type:{
        type: DataTypes.ENUM('registered_user', 'guest'), 
        allowNull: false, 
        defaultValue: 'guest'   
    }
  }, {
    sequelize,
    modelName: 'community_joiner',
  });
  return community_joiner;
};