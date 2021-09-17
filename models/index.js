const User = require('./User');
const Event = require('./Event');
const Interest = require('./Interest');
const UserEvent = require('./UserEvent');
const UserInterest = require('./UserInterest');

// DECLARES THE MANY TO MANY RELATIONSHIP BETWEEN USERS ATTENDING EVENTS
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


// DECLARES THE MANY TO MANY RELATIONSHIP BETWEEN USERS AND THEIR INTERESTS
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


// DECLARES THAT AN EVENT BELONGS TO AN INTEREST, WITH THE "interest_id" FOREIGN KEY IN THE EVENT MODEL TRACKING THE INTEREST TABLE. 
// AS WE HAVE IT SET UP, EACH EVENT HAS ONE INTEREST ATTACHED TO IT, BUT AN INTEREST CAN HAVE MANY EVENTS. 
// INTEREST IS THE SOURCE TABLE, AND EVENT IS THE TARGET TABLE.
// AS THIS IS A ONE TO MANY RELATIONSHIP (not many to many), NO JUNCTION TABLE IS REQUIRED, ONLY A FOREIGN KEY IN THE TARGET TABLE.
Event.belongsTo(Interest, {
  foreignKey: 'interest_id',
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

Interest.hasMany(Event, {
  foreignKey: 'interest_id',
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});



// User.hasMany(Event)

// THIS DECLARES THE RELATIONSHIP BETWEEN WHICH USER CREATED WHICH EVENT. IT IS A ONE TO MANY RELATIONSHIP: AN EVENT CAN ONLY HAVE ONE CREATOR, BUT A USER CAN CREATE MANY EVENTS.
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
