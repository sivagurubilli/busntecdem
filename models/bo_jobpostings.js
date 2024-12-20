'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class JobPosting extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    JobPosting.init({
        uuid: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        company: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        title: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        location: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        experience: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        ctc: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        skills: {
            type: DataTypes.STRING, 
            defaultValue: "",
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        logo: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        jobRequirements: {
            type: DataTypes.STRING, 
            defaultValue: "",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: true,
        }
    }, {
        sequelize,
        modelName: "JobPosting",
        tableName: "bo_job_post",
    });
    // JobPosting.sync({alter : true})
    return JobPosting;
};
