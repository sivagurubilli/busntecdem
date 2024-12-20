"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bucketlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bucketlist.init(
    {
      course_id: DataTypes.INTEGER,
      user_id: DataTypes.STRING,
      data: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "bucketlist",
    }
  );

  // bucketlist.sync({ force: true });
  return bucketlist;
};
