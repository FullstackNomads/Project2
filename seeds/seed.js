const sequelize = require('../config/connection');
const { User, Interest, Event, UserEvent, UserInterest, Message } = require('../models');

const userData = require('./userData.json');
const interestData = require('./interestData.json');
const eventData = require('./eventData.json');
const userEventData = require(`./UserEventData.json`);
const userInterestData = require(`./userInterestData.json`);
const userMessageData = require(`./messageData.json`);

const seedUsers = () => User.bulkCreate(userData, {
  individualHooks: true,
  returning: true
});
const seedInterests = () => Interest.bulkCreate(interestData);
const seedEvents = () => Event.bulkCreate(eventData);
const seedUserEvents = () => UserEvent.bulkCreate(userEventData);
const seedUserInterests = () => UserInterest.bulkCreate(userInterestData);
const seedUserMessages = () => Message.bulkCreate(userMessageData);


const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedInterests();
    console.log('\n----- INTERESTS SEEDED -----\n');

    await seedEvents();
    console.log('\n----- EVENTS SEEDED -----\n');

    await seedUserEvents();
    console.log('\n----- USER EVENTS SEEDED -----\n');

    await seedUserInterests();
    console.log('\n----- USER INTERESTS SEEDED -----\n');

    await seedUserMessages();
    console.log('\n----- USER MESSAGES SEEDED -----\n');


    process.exit(0);

  } catch (err) {
    console.log(err);
  }
};

seedDatabase();
