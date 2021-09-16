const User = require('./User');
const Event = require('./Event');
const Interest = require('./Interest');
const UserEvent = require('./UserEvent');
const UserInterest = require('./UserInterest');

User.belongsToMany(Event, {
  through: UserEvent,
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

Event.belongsToMany(User, {
  through: UserEvent,
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

User.belongsToMany(Interest, {
  through: UserInterest,
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

Interest.belongsToMany(User, {
  through: UserInterest,
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

Event.belongsTo(Interest, {
  foreignKey: 'category_id',
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Interest.hasMany(Event, {
  foreignKey: 'category_id',
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

User.hasMany(Event)
Event.hasOne(User, {
  as: 'creator',
  foreignKey: 'id',
  sourceKey: 'creator_id',
  constraints: false
})

module.exports = {
  User,
  Event,
  Interest,
  UserEvent,
  UserInterest,
};
