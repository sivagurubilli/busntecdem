"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      Menu.hasMany(models.permissions, {
        foreignKey: "menu_id",
        as: "permissions",
      });
    }
  }

  Menu.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4, 
        // unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, 
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isdefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isSideMenu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      },
      classNameOfIcon: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
      classNameOfIconActive: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
      parentClassName: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
      className: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
      isAdminMenu: {
        type: DataTypes.BOOLEAN,
        allowNull: true, 
        defaultValue: false
      },
    },
    {
      sequelize,
      modelName: "menu",
      tableName: "bo_menu",
      timestamps: true,
    }
  );

  // Menu.sync({ alter: true }); 

  return Menu;
};
