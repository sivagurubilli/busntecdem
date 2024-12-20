'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class saveHistory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    saveHistory.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        history_text: {
            type: DataTypes.STRING  ,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        },
        org: {
            type: DataTypes.STRING,
            defaultValue: "",
        }
    }, {
        sequelize,
        modelName: "saveHistory",
        tableName: "bo_search_history",
    });
    // saveHistory.sync()
    return saveHistory;
};