'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // roles.belongsTo(models.users_business_roles, {
      //   // foreignKey: "id",
      //   as: "userrole",
      //   targetKey: "roles_id",
      // })
    }
  }
  roles.init({
    Role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'roles',
  });
  return roles;
};