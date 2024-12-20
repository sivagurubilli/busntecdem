"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class courseUploads extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }
    courseUploads.init(
        {
            uuid: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            section_id: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: "1",
            },
            title: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            course_video: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            resources_list: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            related_vidoes_ids: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            notes_ids: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            external_urls_videos: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            external_resources: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            video_length: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            sequence: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
        },
        {
            sequelize,
            modelName: "courseUploads",
            tableName: "bo_course_uploads",
        }
    );
    // courseUploads.sync({alter : true})
    return courseUploads;
};
