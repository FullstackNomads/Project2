const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Interest extends Model { }

// THIS MODEL TRACKS ALL CURRENT INTERESTS SAVED IN THE DATABASE

Interest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'interest',
  }
);

module.exports = Interest;
