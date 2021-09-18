const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserMessage extends Model { }

UserMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
         model: 'user',
         key: 'id'
       }
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'message',
        key: 'id'
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user_message',
  }
);

module.exports = UserMessage;
