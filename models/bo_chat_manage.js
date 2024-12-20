'use strict';
const {
    Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class userChatManage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userChatManage.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: uuidv4(),
        },
        message_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        receiver_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        sender_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        is_read: {
            type: DataTypes.STRING,
            defaultValue: "0",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        }
    }, {
        sequelize,
        modelName: "userChatManage",
        tableName: "bo_user_chat_manage",
    });
    // userChatManage.sync({ alter: true })
    // userChatManage.sync()
    return userChatManage;
};