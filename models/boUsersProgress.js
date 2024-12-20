'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userCourseProgress extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userCourseProgress.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        course_id: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        status: {
            type: DataTypes?.STRING,
            defaultValue: "1",
        },
        upload_id: {
            type: DataTypes?.STRING,
            defaultValue: "",
        },
        video_progress: {
            type: DataTypes?.STRING,
            defaultValue: "",
        },
        is_completed: {
            type: DataTypes?.STRING,
            defaultValue: "0",
        },
        is_autoplay: {
            type: DataTypes?.STRING,
            defaultValue: "0",
        },
       
    }, {
        sequelize,
        modelName: 'userCourseProgress',
        tableName: 'bo_users_progress',
    });
    // userCourseProgress.sync({alter : true});
    return userCourseProgress;
};