const router = require('express').Router();
const session = require('express-session');
const { Message, UserMessage } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/create', withAuth, async (req, res) => {
  console.log(`POST Message "/create" ROUTE SLAPPED`)
  req.body.sender_id = req.session.user_id;

  try {
    const message = await Message.create({
      ...req.body,
    });
    res.status(200).json(message);
    console.log('\n\n*****NEW MESSAGE SUCCESSFULLY CREATED*****\n\n');
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

module.exports = router;
