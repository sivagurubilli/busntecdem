'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userNotifications extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userNotifications.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        },
        org: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        external_url_title: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        external_url: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        category : {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        description : {
            type: DataTypes.TEXT,
            defaultValue: "",
        }
    }, {
        sequelize,
        modelName: "userNotifications",
        tableName: "bo_user_notifications",
    });
    // userNotifications.sync({alter : true})
    return userNotifications;
};