const router = require('express').Router();
const { Event, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
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
  try {
    res.status(200).render('createEvent');
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/searchUsers', async (req, res) => {
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
  console.log(`GET CREATE PROFILE ROUTE SLAPPED`);
  try {
    // res.status(200).render('createProfile');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/createProfile', async (req, res) => {
  console.log(`POST CREATE PROFILE ROUTE SLAPPED`);
  // console.log(req);
  console.log(JSON.parse(req.body));
  try {
    console.log(req.body);

    // res.render('createProfile', {
    //   ...user,
    //   logged_in: true
    // });

    res.json({})
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
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
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
  console.log('Log in page successfully loaded')
});

module.exports = router;
