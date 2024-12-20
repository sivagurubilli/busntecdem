'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class couresReviews extends Model {
      
        static associate(models) {

            couresReviews.belongsTo(models.CourseContent, {
                foreignKey: "course_id",
                as: "course", // Ensure this matches
            });
        
              
              couresReviews.belongsTo(models.businessusers, {
                foreignKey: "user_id",
                as: "user",
              });
            
        }
    }
    couresReviews.init({
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
        stars: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        comment: {
            type: DataTypes.TEXT,
            defaultValue: '',
        },
        likes: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        dislikes: {
            type: DataTypes.STRING,
            defaultValue: '',
        }
    }, {
        sequelize,
        modelName: 'couresReviews',
        tableName: 'bo_course_reviews',
    });
    // couresReviews.sync({ alter: true });
    return couresReviews;
};