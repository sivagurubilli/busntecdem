"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class adminusers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  adminusers.init(
    {
      email_id: DataTypes.STRING,
      uuid: DataTypes.UUID,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_delete: DataTypes.BOOLEAN,
      roles: DataTypes.STRING,
      password: DataTypes.STRING,
      has_password: DataTypes.BOOLEAN,
      profile_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "adminusers",
    }
  );

  // adminusers.sync();
  return adminusers;
};
