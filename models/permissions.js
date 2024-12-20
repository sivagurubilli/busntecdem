"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Permissions extends Model {
    static associate(models) {
      Permissions.belongsTo(models.businessusers, {
        foreignKey: "user_id",
        as: "user",
      });
      Permissions.belongsTo(models.menu, {
        foreignKey: "menu_id",
        as: "menu",
      });
    }
  }

  Permissions.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4, 
        // unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "businessusers",
          key: "id",
        },
      },
      menu_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, 
      },
    },
    {
      sequelize,
      modelName: "permissions",
      tableName: "bo_permissions",
      timestamps: true,
    }
  );
//   Permissions.sync({alter : true})
  return Permissions;
};
