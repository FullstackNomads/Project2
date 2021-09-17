const router = require('express').Router();
const { Event, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  console.log(`HOMEPAGE ROUTE SLAPPED`)
  try {
    // Get all events and JOIN with user data
    const eventData = await Event.findAll({
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const events = eventData.map((event) => event.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      events,
      logged_in: req.session.logged_in
    });
    console.log('Homepage successfully loaded');
  } catch (err) {
    res.status(500).json(err);
  }
});




router.get('/events/:id', async (req, res) => {
  console.log(`GET /events/:id ROUTE SLAPPED`)
  try {
    const eventData = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    const event = eventData.get({ plain: true });

    res.render('singleEvent', {
      ...event,
      logged_in: req.session.logged_in
    });
    console.log('Single event successfully loaded')
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/searchEvents', async (req, res) => {
  console.log(`GET /searchEvents ROUTE SLAPPED`)
  try {
    // Get all events and JOIN with user data
    const eventData = await Event.findAll({
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const events = eventData.map((event) => event.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('searchEvents', {
      events,
      logged_in: req.session.logged_in
    });
    console.log('All events successfully loaded');
  } catch (err) {
    res.status(500).json(err);
  }
});



// Use withAuth middleware to prevent access to route
// router.get('/createProfile', async (req, res) => {
//   console.log(`CREATE PROFILE ROUTE SLAPPED`);
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Event }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('createProfile', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/createEvent', async (req, res) => {
  console.log(`GET /createEvent ROUTE SLAPPED`)
  try {
    res.status(200).render('createEvent');
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/searchUsers', async (req, res) => {
  console.log(`GET /searchUsers ROUTE SLAPPED`)
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

router.post('/createProfile', async (req, res) => {
  console.log(`POST /createProfile ROUTE SLAPPED`);
  console.log(req.body);
  User.create(req.body)
    .then((User) => {
      console.log(User)
      res.json({})
    })
    .catch((err) => {
      console.log(err)
    })
});

router.get('/profile', withAuth, async (req, res) => {
  console.log(`GET /profile ROUTE SLAPPED`);
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Event }],
    });

    const user = userData.get({ plain: true });

    res.render('userProfile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  console.log(`GET /login ROUTE SLAPPED`);
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
  console.log('Log in page successfully loaded')
});

module.exports = router;
