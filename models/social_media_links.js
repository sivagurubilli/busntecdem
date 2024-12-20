"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class social_media_links extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // social_media_links.belongsTo(models.users_business_roles, {
            //   foreignKey: "id",
            //   as: "business",
            //   targetKey: "business_id",
            // })
            // social_media_links.belongsTo(models.users_business_roles, {
            //   foreignKey: "id",
            //   as: "business",
            //   targetKey: "business_id",
            // });
        }
    }
    social_media_links.init(
        {
            uuid: DataTypes.STRING,
            linkedin: DataTypes.STRING,
            facebook: DataTypes.STRING,
            twitterX: DataTypes.STRING,
            youtube: DataTypes.STRING,
            twitterX: DataTypes.STRING,
            instagram: DataTypes.STRING,
            status: {
                type : DataTypes.STRING,
                defaultValue : "1"
            },
            user_id : DataTypes.STRING
        },
        {
            sequelize,
            modelName: "social_media_links",
        }
    );

    // social_media_links.sync({ force: true });
    return social_media_links;
};
