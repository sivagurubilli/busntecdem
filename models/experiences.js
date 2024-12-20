'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class experiences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  experiences.init({
    user_id: DataTypes.STRING,
    uuid:DataTypes.STRING,
    organization_name: DataTypes.STRING,
    yoe: DataTypes.STRING,
    duration:DataTypes.STRING,
    experience_role: DataTypes.STRING,
    startingDate:DataTypes.STRING,
    endingDate: DataTypes.STRING,
    isEditable:DataTypes.STRING,
    status:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'experiences',
  });
  return experiences ;
};