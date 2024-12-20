

("use strict");
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class JobApply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

JobApply.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
    },
    experience: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    skills: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    user_id: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    education: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    file: {
        type: DataTypes.STRING, 
        defaultValue: "",
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: "JobApply",
    tableName: "job_apply",
});
//   JobApply.sync({alter : true})
  return JobApply;
};
