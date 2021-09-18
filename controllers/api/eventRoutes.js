const router = require('express').Router();
const session = require('express-session');
const { Event, UserEvent } = require('../../models');
const withAuth = require('../../utils/auth');

// router.post('/', withAuth, async (req, res) => {
//   try {
//     const newEvent = await Event.create({
//       ...req.body,
//       creator: req.session.creator,
//     });
//     res.status(200).json(newEvent);
//     console.log('New event successfully created');
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });

router.post('/', withAuth, async (req, res) => {
  console.log(`POST EVENT "/" ROUTE SLAPPED`)
  req.body.creator_id = req.session.user_id;
  try {
    const newEvent = await Event.create({
      ...req.body,
    });
    res.status(200).json(newEvent);
    console.log('\n\n*****NEW EVENT SUCCESSFULLY CREATED*****\n\n');
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});


router.get('/search', async (req, res) => {
  console.log(`GET EVENT "/search" ROUTE SLAPPED`);

  try {
    const parameters = req.query;
    let where = {}

    if (parameters.pointofinterest) {
      where["point_of_interest"] = parameters.pointofinterest;
    }
    if (parameters.city) {
      where["city"] = parameters.city;
    }
    if (parameters.country) {
      where["country"] = parameters.country;
    }

    const eventsData = await Event.findAll({
      where: where
    })
      .then(eventsData => {
        if (!eventsData) {
          res.status(404).json({ message: 'No event found' });
          return;
        }
        const events = eventsData.map((event) => event.get({ plain: true }));
        console.log(events);
        res.json(events);
      })
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// router.delete('/:id', withAuth, async (req, res) => {
//   try {
//     const eventData = await Event.destroy({
//       where: {
//         id: req.params.id,
//         creator: req.session.creator,
//       },
//     });
//     console.log('Event successfully deleted');
//     if (!eventData) {
//       res.status(404).json({ message: 'No event found with this id!' });
//       return;
//     }

//     res.status(200).json(eventData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.delete('/:id', async (req, res) => {
  try {
    const eventData = await Event.destroy({
      where: {
        id: req.params.id,
      },
    });
    console.log('Event successfully deleted');
    if (!eventData) {
      res.status(404).json({ message: 'No event found with this id!' });
      return;
    }

    res.status(200).json(eventData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
