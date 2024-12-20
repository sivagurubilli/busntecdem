"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class SubSection extends Model {
    static associate(models) {
      // SubSection.belongsTo(models.CourseContent, {
      //   foreignKey: "course_id",
      //   as: "course",
      // });
    }
  }

  SubSection.init(
    {
      course_id: {
        type: DataTypes.UUID,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      video_url: {
        type: DataTypes.STRING,
      },
      video_thumbnail: {
        type: DataTypes.STRING,
      },
      video_section: {
        type: DataTypes.STRING,
      },
      video_length: {
        type: DataTypes.NUMERIC,
      },
      video_player: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "SubSection",
      tableName: "subsection",
      underscored: true,
      timestamps: true,
    }
  );
  // SubSection.sync({ force: true });
  // SubSection.sync({ alter: true });

  return SubSection;
};
