'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userNotificationsMap extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userNotificationsMap.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        notification_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        },
        is_read: {
            type: DataTypes.STRING,
            defaultValue: "",
        }

    }, {
        sequelize,
        modelName: "userNotificationMap",
        tableName: "bo_user_notification_map",
    });
    // userNotificationsMap.sync({ alter: true })
    return userNotificationsMap;
};