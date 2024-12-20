"use strict";
const { Model, DataTypes } = require("sequelize");
// const coursesection = require("./coursesection");

module.exports = (sequelize) => {
  class CourseContent extends Model {
    static associate(models) {
      CourseContent.hasMany(models.couresReviews, {
        foreignKey: "course_id",
        as: "reviews", // Ensure alias is correct
    })

      
      CourseContent.belongsTo(models.businessusers, {
        foreignKey: "user_id",
        as: "owner",
      });
    }
  }

  CourseContent.init(
    {
      user_id: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      uuid: {
        type: DataTypes.STRING,
        defaultValue: "",

      },
      course_title: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      course_type: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      course_description: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      course_url: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "1",
      },
      course_usertype: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      course_purchaseId: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      discounted_price: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      actual_price: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      thumbnail: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      level: {
        defaultValue: "",
        type: DataTypes.STRING,
      },
      ratings: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      purchased_count: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      related_vidoes_ids: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      course_offers: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      course_requirements: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      course_features: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      course_preview: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "CourseContent",
      tableName: "bo_course_content",
      underscored: true,
      timestamps: true,
    }
  );
  // CourseContent.sync({ alter: true });
  return CourseContent;
};
