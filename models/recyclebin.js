'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class recycleBin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    recycleBin.init({
        user_id: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        recycle_key: {
            type: DataTypes.STRING,
            defaultValue: "1"
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: ""
        },
        row_uuid: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: ""
        },
        recycle_data: {
            type: DataTypes.TEXT,
            defaultValue: ""
        },
        course_id: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1"
        },
    }, {
        sequelize,
        modelName: 'recycleBin',
        tableName: 'bo_recycle_bin',
    });
    // recycleBin.sync({alter: true})
    return recycleBin;
};