const router = require('express').Router();
const { User, UserInterest, UserEvent } = require('../../models');
const withAuth = require('../../utils/auth');
const { Op } = require(`sequelize`)

router.post('/', async (req, res) => {
  console.log(`POST USER "/" ROUTE SLAPPED`)
  console.log(req.body)
  try {
    const userData = await User.create(req.body) //create a new user by just passing the entire req.body
      .then((user) => {
        // If there are interests, we need to create an array of objects that we can pass to bulkCreate() to make entries in the UserInterest junction table. 
        // This is done by checking if there are any selected interests by the .length property of the interests from the req.body. If length == 0, that is a falsy value, and the entire "if" statement will be skipped. If length >= 1, then that is a truthy value, thus the "if" statement will proceed to execute and create entries in the UserInterest table. 
        if (req.body.interests.length) {
          //to actually create the entries, we call map() on the interests array from the original req.body, which will return a new array whose contents are the results of calling the callback function on each element in the array. So for each value in the interest array, the below will push an object to the new array with:
          // * the user_id set to the id of the user that was just created
          // * the interest_id set to the interest_id value from the current iteration on the interest array
          const userInterestIdArray = req.body.interests.map((interest_id) => {
            return {
              user_id: user.id,
              interest_id,
            };
          });
          return UserInterest.bulkCreate(userInterestIdArray);
        }
        // if no interest tags and the if statement was skipped, just respond.
        res.status(200).json(user)
      })
      .then((userInterestIds) => res.status(200).json(userInterestIds))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      })
    // commented out the below as we need to decide if we want a new user to be automatically logged in to their new profile after it is created OR if we want to auto redirect them to the login page
    // req.session.save(() => {
    //   req.session.user_id = userData.id;
    //   req.session.logged_in = true;

    //   res.status(200).json(userData);
    // });

    console.log('New user successfully created');
  } catch (err) {
    res.status(400).json(err);
  }
});



router.get('/search', withAuth, async (req, res) => {
  console.log(`GET USER "/search" ROUTE SLAPPED`);
  try {
    const parameters = req.query;
    console.log(`\n\n`)
    console.log(parameters)
    console.log(`\n\n`)


    // IF THERE ARE INTEREST FILTERS SELECTED, GO THIS ROUTE
    if (parameters.hasOwnProperty(`interests`)) {
      console.log(`\n\nINTERESTS SELECTED\n\n`)
      let userInterestsData = await UserInterest.findAll({
        where: {
          interest_id: {
            [Op.or]: [...parameters.interests]
          }
        }
      });
      if (!userInterestsData.length) {
        res.status(404).json({ message: 'No user found' });
        return;
      };

      let userInterests = userInterestsData.map((userInterest) => userInterest.get({ plain: true }));
      let userIdsWithInterests = userInterests.map((entry) => entry.user_id)
      let usersWithInterestsProfilesData = await User.findAll({
        where: {
          id: {
            [Op.or]: [...userIdsWithInterests]
          }
        }
      });

      let usersWithInterestsProfiles = usersWithInterestsProfilesData.map((user) => user.get({ plain: true }));


      console.log(usersWithInterestsProfiles);


      if (parameters.gender) {
        console.log(`\n\nGENDER INCLUDED\n\n`);
        for (let i = usersWithInterestsProfiles.length - 1; i >= 0; i--) {
          console.log('\n', usersWithInterestsProfiles[i].first_name)
          console.log("CURRENT USER ITERATION GENDER: ", usersWithInterestsProfiles[i].gender);
          console.log("GENDER PARAMETER PASSED BY USER: ", parameters.gender);
          console.log(usersWithInterestsProfiles[i].gender === parameters.gender)
          if (usersWithInterestsProfiles[i].gender !== parameters.gender) {
            console.log(usersWithInterestsProfiles[i].first_name, "REMOVED")
            usersWithInterestsProfiles.splice(i, 1)
          }
        }
      };

      if (parameters.city) {
        console.log(`\n\nCITY INCLUDED\n\n`);
        for (let i = usersWithInterestsProfiles.length - 1; i >= 0; i--) {
          console.log('\n', usersWithInterestsProfiles[i].first_name)
          console.log("CURRENT USER ITERATION CITY: ", usersWithInterestsProfiles[i].city_name);
          console.log("CITY PARAMETER PASSED BY USER: ", parameters.city);
          console.log(usersWithInterestsProfiles[i].city_name === parameters.city)
          if (usersWithInterestsProfiles[i].city_name !== parameters.city) {
            console.log(usersWithInterestsProfiles[i].first_name, "REMOVED")
            usersWithInterestsProfiles.splice(i, 1)
          }
        }
      };

      if (parameters.country) {
        console.log(`\n\nCOUNTRY INCLUDED\n\n`);
        for (let i = usersWithInterestsProfiles.length - 1; i >= 0; i--) {
          console.log('\n', usersWithInterestsProfiles[i].first_name)
          console.log("CURRENT USER ITERATION COUNTRY: ", usersWithInterestsProfiles[i].country_name);
          console.log("COUNTRY PARAMETER PASSED BY USER: ", parameters.country);
          console.log(usersWithInterestsProfiles[i].country === parameters.country)
          if (usersWithInterestsProfiles[i].country_name !== parameters.country) {
            console.log(usersWithInterestsProfiles[i].first_name, "REMOVED")
            usersWithInterestsProfiles.splice(i, 1)
          }
        }
      };

      if (!userInterestsData.length) {
        res.status(404).json({ message: 'No user found' });
        return;
      }

      res.json(usersWithInterestsProfiles);
      return;
    };

    // IF THERE ARE NO INTEREST FILTERS SELECTED, GO THIS ROUTE***
    console.log(`NO INTERESTS SELECTED`)

    let where = {}
    if (parameters.gender) {
      where["gender"] = parameters.gender;
    };

    if (parameters.city) {
      where["city_name"] = parameters.city;
    };

    if (parameters.country) {
      where["country_name"] = parameters.country;
    };

    console.log(where)

    await User.findAll({
      where: where
    })
      .then(usersData => {
        // console.log(usersData);
        if (!usersData) {
          res.status(404).json({ message: 'No user found' });
          return;
        }
        // console.log(usersData); // ADDED THIS FOR DIAGNOSTIC PURPOSES
        res.json(usersData);
      })

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});



router.post('/login', async (req, res) => {
  console.log(`POST USER "/login" ROUTE SLAPPED`)
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
    console.log(`\n\n********** USER ${userData.first_name} ${userData.last_name} LOGIN SUCCESSFUL! **********\n\n`);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  console.log(`POST USER "/logout" ROUTE SLAPPED`)
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
    console.log('User log out successful');
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    console.log('User successfully deleted');
    req.session.destroy(() => {
      res.status(204).end();
    })
    if (!userData) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
