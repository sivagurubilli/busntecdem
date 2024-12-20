'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  commentReport.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    user_id: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    comment_id: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    reportReason: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    issue: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    review_id: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "1"
    },
  }, {
    sequelize,
    modelName: 'commentReport',
  });

  return commentReport;
};
