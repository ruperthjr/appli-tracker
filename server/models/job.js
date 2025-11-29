"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Job.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Job.init(
    {
      jobtitle: DataTypes.STRING,
      company: DataTypes.STRING,
      location: DataTypes.STRING,
      jobtype: DataTypes.STRING,
      salary: DataTypes.STRING,
      description: DataTypes.TEXT,
      date: DataTypes.DATEONLY,
      roundStatus: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      review: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Job",
    }
  );
  return Job;
};