const router = require('express').Router();
const { Event, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  console.log(`HOMEPAGE "/" ROUTE SLAPPED`)
  console.log(req.session.logged_in)
  if(req.session.logged_in){
    res.render('userDashboard', {  
        logged_in: req.session.logged_in
    });
  }else{
    res.render('homepage', {
      logged_in: req.session.logged_in
    });
  }
});


router.get('/about', async (req, res) => {
  console.log(`About "/" ROUTE SLAPPED`)
  res.render('about', {});
});



router.get('/user/:id', async (req, res) => {
  console.log(`GET /user/:id ROUTE SLAPPED`)
  try {
    const profileData = await User.findByPk(req.params.id, {});

    const eventData = await Event.findAll({
      where: {
        creator_id: req.params.id
      }
    });    
    const events = eventData.map((event) => event.get({ plain: true }));
    console.log("eventsss:", events)
    const user = profileData.get({ plain: true });
    res.render('userProfile', {
      ...user,
      events: events,
      logged_in: req.session.logged_in
    });
    console.log('Single user successfully loaded')
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
    res.render('searchEvents', {
      logged_in: req.session.logged_in
    });  
});

router.get('/userDashboard', async (req, res) => {
  console.log(`GET /userDashboard ROUTE SLAPPED`)
    res.render('userDashboard', {
      logged_in: req.session.logged_in
    });  
});


router.get('/createEvent', async (req, res) => {
  console.log(`GET /createEvent ROUTE SLAPPED`)
  res.render('createEvent', {
    logged_in: req.session.logged_in
  });  
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

router.get('/user', withAuth, async (req, res) => {
  console.log(`GET /user ROUTE SLAPPED`);
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      // include: [{ model: Event }],
    });
    console.log("myuserdata",req.session.user_id,  userData)
    const user = userData.get({ plain: true });

    res.render('userProfile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
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

  res.render('login');
  console.log('Log in page successfully loaded')
});

module.exports = router;
