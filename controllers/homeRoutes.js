const router = require('express').Router();
const { Event, User, UserEvent, UserInterest, Message, Interest } = require('../models');
const withAuth = require('../utils/auth');
const { format_date_long, format_date_time } = require(`../utils/helpers`);

// needed to make findAll more specific to what we need for messages
const Op = require('sequelize').Op


function getUniqueListBy(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}


router.get('/', async (req, res) => {
  console.log(`HOMEPAGE "/" ROUTE SLAPPED`)
  console.log(req.session.logged_in)
  if (req.session.logged_in) {
    res.render('userDashboard', {
      logged_in: req.session.logged_in
    });
  } else {
    res.render('homepage', {
      logged_in: req.session.logged_in
    });
  }
});


router.get('/about', async (req, res) => {
  console.log(`GET "/about" ROUTE SLAPPED`)
  res.render('about', {});
});



router.get('/user/:id', async (req, res) => {
  console.log(`GET /user/${req.params.id} ROUTE SLAPPED`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  // if user attempts to view their own page, redirect to their dashboard so that delete buttons appear on the events
  if (req.session.user_id === req.params.id) {
    res.redirect('/user')
    return;
  }

  try {
    const profileData = await User.findByPk(req.params.id, {});

    const eventData = await Event.findAll({
      where: {
        creator_id: req.params.id
      }
    });
    const events = eventData.map((event) => event.get({ plain: true }));
    // Format event dates
    events.forEach((event) => event.date_time = format_date_long(event.date_time));

    const user = profileData.get({ plain: true });

    const userInterestData = await UserInterest.findAll({
      where: {
        user_id: user.id
      }
    })

    const userInterestEntries = userInterestData.map((userInterest) => userInterest.get({ plain: true }));
    const userInterestIds = userInterestEntries.map((userInterestEntry) => userInterestEntry.interest_id);
    const interestsData = await Interest.findAll({
      attributes: ['name'],
      where: {
        id: {
          [Op.or]: [userInterestIds]
        }
      }
    });
    const interestEntries = interestsData.map((interest) => interest.get({ plain: true }));

    const interests = interestEntries.map((interest) => interest.name)
    const interestString = interests.join(', ')
    console.log(interestString)

    res.render('userProfile', {
      ...user,
      events: events,
      sameUser: req.params.id == req.session.user_id,
      logged_in: req.session.logged_in,
      interests: interestString
    });
    console.log('Single user successfully loaded')
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/events/:id', async (req, res) => {
  console.log(`\n\nGET /events/${req.params.id} ROUTE SLAPPED\n\n`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  try {
    const eventData = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name']
        },
      ],
    });
    const event = eventData.get({ plain: true });
    // FORMAT DATE
    event.date_time = format_date_long(event.date_time);
    const creatorData = await User.findByPk(eventData.creator_id);

    const interestData = await Interest.findByPk(eventData.interest_id);
    const interest = interestData.get({ plain: true }).name;

    const attendeeData = await UserEvent.findAll({
      where: { event_id: req.params.id }
    });

    // convert results into an array javascript objects
    const attendees = attendeeData.map((attendee) => attendee.get({ plain: true }));

    // filter out just the user ids from those entries
    const attendeeUserIds = attendees.map((attendee) => attendee.user_id);

    // Get the profiles for each user that is attending 
    const attendeeProfiles = await User.findAll({
      where: {
        id: {
          [Op.or]: [attendeeUserIds]
        }
      }
    });

    // convert results into an array javascript objects
    const attendeeProfileObjects = attendeeProfiles.map((attendee) => attendee.get({ plain: true }));

    res.render('singleEvent', {
      ...event,
      logged_in: req.session.logged_in,
      creatorName: `${creatorData.first_name} ${creatorData.last_name}`,
      attendees: attendeeProfileObjects,
      interest: interest
    });
    console.log('Single event successfully loaded')
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/searchEvents', async (req, res) => {
  console.log(`GET /searchEvents ROUTE SLAPPED`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  res.render('searchEvents', {
    logged_in: req.session.logged_in
  });
});

router.get('/userDashboard', async (req, res) => {
  console.log(`GET /userDashboard ROUTE SLAPPED`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  res.render('userDashboard', {
    logged_in: req.session.logged_in
  });
});

// Route to get all messages 
router.get('/messages', withAuth, async (req, res) => {
  console.log(`GET /messages ROUTE SLAPPED`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  try {
    // Get all messages where i am the sender or receiver 
    const messageData = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.session.user_id }, { receiver_id: req.session.user_id }
        ]
      }
    });


    // Serialize data so the template can read it
    let messages = messageData.map((message) => message.get({ plain: true }));


    // For each message, store the other person id in ["user"]
    for (i = 0; i < messages.length; i++) {
      console.log(messages[i]);
      if (messages[i].sender_id != req.session.user_id) {
        messages[i]["user"] = messages[i].sender_id
      }
      if (messages[i].receiver_id != req.session.user_id) {
        messages[i]["user"] = messages[i].receiver_id
      }
    }
    // filter the messages to get only the unique users that has have some sort of communication with me
    messages = getUniqueListBy(messages, "user")

    for (let i = 0; i < messages.length; i++) {
      let item = messages[i];
      let u = item.user;
      const u_details = await User.findByPk(u)
      item["first_name"] = u_details.first_name;
      item["last_name"] = u_details.last_name;
    }

    console.log(messages)
    // Pass serialized data and session flag into template
    res.render('message', {
      messages,
      userId: req.session.user_id,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/messages/:id', withAuth, async (req, res) => {
  console.log(`GET /messages ROUTE SLAPPED`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  try {
    // Get all messages
    const messageData = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.session.user_id }, { receiver_id: req.session.user_id }
        ]
      }
    });

    // Example:
    // John (id=1) sends a message to Bill (id=2) with message content: Hello 
    // Bill(id=2) sends a message to John(id=1) with message content: Hi there
    // If we want to get all messages between John and bill to display them in the page, 
    // We need to query our database and ask it for the following:
    // o	Give me all messages where the sender is 1 and receiver is 2
    // o	And
    // o	Give me all messages where the sender is 2 and receiver 1
    const messageBetweenData = await Message.findAll({
      where: {
        [Op.or]: [
          { [Op.and]: [{ sender_id: req.session.user_id }, { receiver_id: req.params.id }] },
          { [Op.and]: [{ sender_id: req.params.id }, { receiver_id: req.session.user_id }] },
        ]
      },
      order: [['createdAt', 'ASC']]
    })

    // Serialize data so the template can read it
    let messages = messageData.map((message) => message.get({ plain: true }));
    for (i = 0; i < messages.length; i++) {
      console.log(messages[i]);
      if (messages[i].sender_id != req.session.user_id) {
        messages[i]["user"] = messages[i].sender_id
      }
      if (messages[i].receiver_id != req.session.user_id) {
        messages[i]["user"] = messages[i].receiver_id
      }
    }
    messages = getUniqueListBy(messages, "user")
    for (let i = 0; i < messages.length; i++) {
      let item = messages[i];
      let u = item.user; // the user id
      const u_details = await User.findByPk(u)
      item["first_name"] = u_details.first_name;
      item["last_name"] = u_details.last_name;
    }

    const messagesBetween = messageBetweenData.map((message) => message.get({ plain: true }));

    for (let i = 0; i < messagesBetween.length; i++) {
      let item = messagesBetween[i];
      let u = item.sender_id;
      const u_details = await User.findByPk(u)
      item["sender_first_name"] = u_details.first_name;
      item["sender_last_name"] = u_details.last_name;
    }


    // Pass serialized data and session flag into template
    res.render('message', {
      messages,
      messagesBetween,
      specific_user: true,
      userId: req.session.user_id,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/createEvent', withAuth, async (req, res) => {
  console.log(`GET /createEvent ROUTE SLAPPED`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  res.render('createEvent', {
    logged_in: req.session.logged_in
  });
});


router.get('/searchUsers', async (req, res) => {
  console.log(`GET /searchUsers ROUTE SLAPPED`)

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  try {
    // Get all events and JOIN with user data
    const userData = await User.findAll({});

    // Serialize data so the template can read it
    const users = userData.map((user) => user.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('searchUsers', {
      users,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/createProfile', async (req, res) => {
  console.log(`GET /createProfile ROUTE SLAPPED`);
  try {
    res.status(200).render('createProfile');
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/user', withAuth, async (req, res) => {
  console.log(`GET /user ROUTE SLAPPED`);

  if (!req.session.logged_in) {
    res.redirect('/login');
    return;
  }

  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Event }],
    });
    const eventData = await Event.findAll({
      where: {
        creator_id: req.session.user_id
      }
    });


    const user = userData.get({ plain: true });
    const events = eventData.map((event) => event.get({ plain: true }));

    // Format dates
    events.forEach((event) => event.date_time = format_date_long(event.date_time));





    const userInterestData = await UserInterest.findAll({
      where: {
        user_id: user.id
      }
    })

    const userInterestEntries = userInterestData.map((userInterest) => userInterest.get({ plain: true }));
    const userInterestIds = userInterestEntries.map((userInterestEntry) => userInterestEntry.interest_id);
    const interestsData = await Interest.findAll({
      attributes: ['name'],
      where: {
        id: {
          [Op.or]: [userInterestIds]
        }
      }
    });
    const interestEntries = interestsData.map((interest) => interest.get({ plain: true }));

    const interests = interestEntries.map((interest) => interest.name)
    const interestString = interests.join(', ')
    console.log(interestString)

    res.render('userProfile', {
      ...user,
      events: events,
      sameUser: true,
      logged_in: true,
      interests: interestString
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});


// THIS ROUTE ONLY RETURNS THE LOGIN PAGE. IT DOES NOT ACTUALLY SEND THE EMAIL AND PASS FOR LOGIN VALIDATION. THAT IS IN THE API ROUTES.
router.get('/login', (req, res) => {
  console.log(`GET /login ROUTE SLAPPED`);
  console.log(req.body)
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {

    res.redirect('/userDashboard');
    return;
  }

  res.render('login', { layout: false });
  console.log('Log in page successfully loaded')
});

module.exports = router;
