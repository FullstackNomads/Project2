const router = require('express').Router();
const session = require('express-session');
const { Message, UserMessage } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/create', withAuth, async (req, res) => {
  console.log(`POST MESSAGE "/create" ROUTE SLAPPED`)
  req.body.sender_id = req.session.user_id;
  
  try {
    const newMessage = await Message.create({
      ...req.body,
    });
    res.status(200).json({});
    console.log('\n\n*****NEW MESSAGE SUCCESSFULLY CREATED*****\n\n');
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

module.exports = router;
