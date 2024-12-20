'use strict';
const {
    Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class userQuestions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userQuestions.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: uuidv4(),
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        username: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        question: {
            type: DataTypes.STRING,
            defaultValue: "1",
        },
        answer: {
            type: DataTypes.TEXT,
            defaultValue: "",
        },
        course_video_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    }, {
        sequelize,
        modelName: "userQuestions",
        tableName: "bo_user_questions",
    });
    // userQuestions.sync({ alter: true })
    return userQuestions;
};