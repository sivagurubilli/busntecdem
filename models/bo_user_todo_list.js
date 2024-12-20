'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class toDoList extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    toDoList.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        to_do_text: {
            type: DataTypes.TEXT,
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "1",
        },
        is_checked: {
            type: DataTypes.STRING,
            defaultValue: "0",
        },

    }, {
        sequelize,
        modelName: "toDoList",
        tableName: "bo_user_todo_list",
    });
    // toDoList.sync({alter : true})
    return toDoList;
};