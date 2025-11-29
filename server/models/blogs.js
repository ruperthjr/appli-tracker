"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Blogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blogs.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Blogs.init(
    {
      company: DataTypes.STRING,
      review: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      salary: DataTypes.STRING,
      rounds: DataTypes.ARRAY(DataTypes.STRING),
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Blogs",
    }
  );
  return Blogs;
};