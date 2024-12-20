'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class reviewManage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    reviewManage.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        course_id: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        status: {
            type: DataTypes?.STRING,
            defaultValue: "1",
        },
        review_id: {
            type: DataTypes?.STRING,
        }
    }, {
        sequelize,
        modelName: 'reviewManage',
        tableName: 'bo_review_manage',
    });
    // reviewManage.sync({ alter: true });
    return reviewManage;
};