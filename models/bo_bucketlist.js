'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userBucketList extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userBucketList.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        youtube_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        course_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        mentor_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        category: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        thumbnail: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: true,
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        flow_data: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "",
        },
    }, {
        sequelize,
        modelName: "userBucketList",
        tableName: "bo_bucketlist",
    });
    // userBucketList.sync({alter : true})
    return userBucketList;
};