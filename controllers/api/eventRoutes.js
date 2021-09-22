const router = require('express').Router();
const session = require('express-session');
const { Event, UserEvent } = require('../../models');
const withAuth = require('../../utils/auth');
const { Op } = require(`sequelize`)


router.post('/', withAuth, async (req, res) => {
  console.log(`POST EVENT "/" ROUTE SLAPPED`)
  req.body.creator_id = req.session.user_id;
  try {
    const newEvent = await Event.create({
      ...req.body,
    });
    res.status(200).json({ "id": newEvent.id });
    console.log('\n\n*****NEW EVENT SUCCESSFULLY CREATED*****\n\n');
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.post('/joinEvent', withAuth, async (req, res) => {
  console.log(`\n\nPOST EVENT "/joinEvent" ROUTE SLAPPED\n\n`)
  // console.log(req.body)
  req.session.user_id = parseInt(req.session.user_id);
  console.log(req.session.user_id)
  try {
    req.body.user_id = req.session.user_id;
    console.log(req.body);
    const newEvent = await UserEvent.create({
      ...req.body,
    });
    res.status(200).json({ messsage: `You have been signed up to join this event!` });
    console.log('\n\n*****USER HAS BEEN ADDED TO EVENT*****\n\n');
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});


router.get('/search', async (req, res) => {
  console.log(`GET EVENT "/search" ROUTE SLAPPED`);
  try {
    const parameters = req.query;
    console.log(`\n\n`)
    console.log(parameters)
    console.log(`\n\n`)


    // IF THERE ARE INTEREST FILTERS SELECTED, GO THIS ROUTE
    if (parameters.hasOwnProperty(`interests`)) {
      console.log(`\n\nINTERESTS SELECTED\n\n`)
      let eventsWithInterestData = await Event.findAll({
        where: {
          interest_id: {
            [Op.or]: [...parameters.interests]
          }
        }
      });
      let eventsWithInterest = eventsWithInterestData.map((event) => event.get({ plain: true }));
      if (!eventsWithInterest.length) {
        res.status(404).json({ message: 'No event found' });
        return;
      };

      console.log(eventsWithInterest);

      if (parameters.city) {
        console.log(`\n\nCITY INCLUDED\n\n`);
        for (let i = eventsWithInterest.length - 1; i >= 0; i--) {
          console.log('\n', eventsWithInterest[i].event_name)
          console.log("CURRENT EVENT ITERATION CITY: ", eventsWithInterest[i].city);
          console.log("COUNTRY PARAMETER PASSED BY USER: ", parameters.city);
          console.log(eventsWithInterest[i].city === parameters.city)
          if (eventsWithInterest[i].country !== parameters.country) {
            console.log(eventsWithInterest[i].event_name, "REMOVED")
            eventsWithInterest.splice(i, 1)
          }
        }
      };

      if (parameters.country) {
        console.log(`\n\nCOUNTRY INCLUDED\n\n`);
        for (let i = eventsWithInterest.length - 1; i >= 0; i--) {
          console.log('\n', eventsWithInterest[i].event_name)
          console.log("CURRENT EVENT ITERATION COUNTRY: ", eventsWithInterest[i].country);
          console.log("COUNTRY PARAMETER PASSED BY USER: ", parameters.country);
          console.log(eventsWithInterest[i].country === parameters.country)
          if (eventsWithInterest[i].country !== parameters.country) {
            console.log(eventsWithInterest[i].event_name, "REMOVED")
            eventsWithInterest.splice(i, 1)
          }
        }
      };

      if (!eventsWithInterest.length) {
        res.status(404).json({ message: 'No event found' });
        return;
      };

      console.log(eventsWithInterest);
      res.json(eventsWithInterest);
      return;
    };

    // IF THERE ARE NO INTEREST FILTERS SELECTED, GO THIS ROUTE***
    let where = {}

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


router.delete('/:id', withAuth, async (req, res) => {
  console.log(`\nEVENT DELETE "/" ROUTE SLAPPED\n`)
  console.log(`THE CURRENTLY LOGGED IN USER_ID IS:\n`, req.session.user_id)
  let eventToBeDeleted = await Event.findByPk(req.params.id, {});
  console.log(`THE CREATOR_ID OF THE EVENT THE USER IS TRYING TO DELETE IS:\n`, eventToBeDeleted.creator_id);

  if (req.session.user_id !== eventToBeDeleted.creator_id) {
    return res.status(405).json({ message: 'You may only delete events that you have created.' })
  }
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

router.put('/:id', async (req, res) => {
  try {
    const event = await Event.update(
      {
        event_name: req.body.event_name,
        date_time: req.body.date_time,
        description: req.body.description,
      },
      {
        where: {
          id: req.params.id,
        },
      });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;
