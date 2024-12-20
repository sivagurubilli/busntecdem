'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userTypes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    userTypes.init({
        name: DataTypes.STRING,
        json_tag: DataTypes.STRING,
        status: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'user_types',    
        defaultScope: {
            order: [['id', 'ASC']]
        }
    });
    return userTypes;
};