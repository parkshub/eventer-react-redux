const express = require("express");
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const eventController = require('../controllers/eventController')

router.post('/', auth, eventController.createEvent)
router.get('/getUserEvents/:id', auth, eventController.getUserEvents)
router.delete('/deleteEvent/:id', auth, eventController.deleteEvent)
router.put('/updateEvent/:id', auth, eventController.updateEvent)

// since we're using JWT tokens loggin out will be handled by one of slice services by just removing user from local storage

module.exports = router