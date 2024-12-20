'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userCertificates extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    userCertificates.init({
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
        course_name: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        student_name: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        mentor_name: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        }
    }, {
        sequelize,
        modelName: "userCertificates",
        tableName: "bo_user_certificates",
    });
    // userCertificates.sync({alter : true})
    return userCertificates;
};