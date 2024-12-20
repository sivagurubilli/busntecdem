'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userPurchased extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userPurchased.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        course_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        },
        bought_price: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        actual_price: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        order_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        }
    }, {
        sequelize,
        modelName: "userPurchased",
        tableName: "bo_user_purchased",
    });
    // userPurchased.sync({alter: true})
    return userPurchased;
};