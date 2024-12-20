'use strict';
const {
    Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class userChat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userChat.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: uuidv4(),
        },
        to_user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        from_user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        message_text: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        attachments: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        },
        is_group_chat: {
            type: DataTypes.STRING,
            defaultValue: "0",
        }
    }, {
        sequelize,
        modelName: "userChat",
        tableName: "bo_user_chat",
    });
    // userChat.sync({ alter: true })
    // userChat.sync()
    return userChat;
};