"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class businessusers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      businessusers.hasMany(models.CourseContent, {
        foreignKey: "user_id",
        as: "courses",
      });

      businessusers.hasMany(models.couresReviews, {
        foreignKey: "user_id",
        as: "reviews",  
      });
    }
  }
  businessusers.init(
    {
      bus_email: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      uuid: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      first_name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      last_name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
      mobile_number: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      address: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      roles: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      password: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      has_password: { type: DataTypes.BOOLEAN, defaultValue: false },
      profile_url: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      email_verify_token: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      email_expiry: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      change_password_token: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      login_type: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      provider_token: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      bus_acnt_name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      city: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      state: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      country: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      otp: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      otp_expiry: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      dob: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      time_zone: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      time_format: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      date_format: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "businessusers",
    }
  );

  // businessusers.sync({ force: true });
  // businessusers.sync({ alter: true });
  return businessusers;
};
