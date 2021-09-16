const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserEvent extends Model { }

// THIS MODEL TRACKS WHICH USERS ARE ATTENDING WHAT EVENTS. 

// IT IS CONSIDERED A "JUNCTION TABLE" AND IT TRACKS EACH INDIVIDUAL RELATIONSHIP BETWEEN THE USER MODEL, AND THE EVENT MODEL. A JUNCTION TABLE IS REQUIRED FOR ALL MANY TO MANY RELATIONSHIPS BETWEEN TABLES.

UserEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event',
        key: 'id'
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_event',
  }
);

module.exports = UserEvent;
