'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // users.belongsTo(models.users_business_roles, {
      //   // foreignKey: 'id',
      //   // as: 'UBR',
      //   // targetKey: 'user_id',
      // })

    }
  }
  users.init({
    email_id: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    is_delete: DataTypes.BOOLEAN,
    mobile_number: DataTypes.INTEGER,
    address: DataTypes.STRING,
    roles: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    has_password: DataTypes.BOOLEAN,
    profile_url: DataTypes.STRING,
    email_verify_token: DataTypes.STRING,
    change_password_token: DataTypes.STRING,
    login_type: DataTypes.STRING,
    provider_token: DataTypes.STRING,
    // profile_summary: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
    defaultScope: {
      attributes: {
        exclude: ['password']
      },
      order: [['id', 'ASC']]
    }
  });
  return users;
};