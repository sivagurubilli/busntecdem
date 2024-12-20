'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class ServiceRequest extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define associations here if necessary
        }
    }

    ServiceRequest.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: uuidv4(),
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        email: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        service: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        message: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: true,
        }
    }, {
        sequelize,
        modelName: "ServiceRequest",
        tableName: "service_requests",
    });

    // ServiceRequest.sync({ force: true })
    return ServiceRequest;
};
