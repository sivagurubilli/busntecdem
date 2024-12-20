"use strict";
const { Model, DataTypes } = require("sequelize");
// const coursesection = require("./coursesection");

module.exports = (sequelize) => {
    class CourseSections extends Model {
        static associate(models) {
            // Define associations here
            // CourseUpload.hasMany(models.CourseSections, {
            //   foreignKey: "course_id",
            //   as: "contents",
            // });
        }
    }

    CourseSections.init(
        {
            course_id: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            uuid: {
                type: DataTypes.STRING,
                defaultValue: "",

            },
            section_title: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "1",
            },
            sequence: {
                type: DataTypes.STRING,
                defaultValue: "1",
            },

        },
        {
            sequelize,
            modelName: "CourseSections",
            tableName: "bo_course_sections",
            underscored: true,
            timestamps: true,
        }
    );
    // CourseSections.sync({ alter: true });
    return CourseSections;
};
