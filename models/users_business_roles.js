"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users_business_roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      users_business_roles.belongsTo(models.businessusers, {
        // foreignKey: "business_id",
        as: "business",
        targetKey: "id",
      });
      users_business_roles.belongsTo(models.roles, {
        // foreignKey: "roles_id",
        as: "userrole",
        targetKey: "id",
      });
      users_business_roles.belongsTo(models.users, {
        // foreignKey: "user_id",
        as: "UBR",
        targetKey: "id",
      });
    }
  }
  users_business_roles.init(
    {
      user_id: DataTypes.INTEGER,
      business_id: DataTypes.INTEGER,
      roles_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "users_business_roles",
    }
  );
  return users_business_roles;
};
