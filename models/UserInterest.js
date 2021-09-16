const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserInterest extends Model { }

// THIS MODEL TRACKS WHICH USERS HAVE WHICH INTERESTS. 

// IT IS CONSIDERED A "JUNCTION TABLE" AND IT TRACKS EACH INDIVIDUAL RELATIONSHIP BETWEEN THE USER MODEL, AND THE INTEREST MODEL. A JUNCTION TABLE IS REQUIRED FOR ALL MANY TO MANY RELATIONSHIPS BETWEEN TABLES.

UserInterest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    interest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'interest',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_interest',
  }
);

module.exports = UserInterest;
