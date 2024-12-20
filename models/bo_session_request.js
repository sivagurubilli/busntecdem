'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class sessionRequest extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    sessionRequest.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: uuidv4(),
        },
        mentor_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        student_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        scheduled: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        }
    }, {
        sequelize,
        modelName: "sessionRequest",
        tableName: "bo_session_requests",
    });

    // sessionRequest.sync()
    // sessionRequest.sync({alter : true})

    return sessionRequest;
};