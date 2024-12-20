'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userWishlist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userWishlist.init({
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
        org: {
            type: DataTypes.STRING,
            defaultValue: "tecdemy",
        }
    }, {
        sequelize,
        modelName: "userWishlist",
        tableName: "bo_user_wishlist",
    });
    // userWishlist.sync({alter : true})
    return userWishlist;
};