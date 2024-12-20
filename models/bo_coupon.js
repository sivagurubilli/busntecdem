'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userCoupon extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userCoupon.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        coupon: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        org: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        discount_percentage: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        }
    }, {
        sequelize,
        modelName: "userCoupon",
        tableName: "bo_user_coupon",
    });
    // userCoupon.sync({ alter: true })
    return userCoupon;
};