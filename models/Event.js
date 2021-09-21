const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Event extends Model { }

// THIS MODEL TRACKS ALL CURRENT EVENTS SAVED IN THE DATABASE

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    point_of_interest: {
      type: DataTypes.STRING,
      // NOT REQUIRED
    },
    location: {
      type: DataTypes.STRING,
      // grab from google.api
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      // grab from google.api
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      // grab from google.api
    },
    interest_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'interest',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'event',
  }
);

module.exports = Event;
