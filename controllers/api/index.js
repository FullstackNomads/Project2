const router = require('express').Router();
const userRoutes = require('./userRoutes');
const eventRoutes = require('./eventRoutes');
const messageRoutes = require('./messageRoutes');


router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/messages', messageRoutes);

module.exports = router;