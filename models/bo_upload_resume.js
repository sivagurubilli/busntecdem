

("use strict");
const { Model } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
// const uploadResume = require("../middleware/uploadResume");

module.exports = (sequelize, DataTypes) => {
  class uploadResume extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  uploadResume.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: uuidv4(),
    },
    user_id: {
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
    modelName: "uploadResume",
    tableName: "bo_user_resume",
});
//   uploadResume.sync({alter : true})
  return uploadResume;
};
