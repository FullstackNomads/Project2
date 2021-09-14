const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserInterest extends Model { }

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
