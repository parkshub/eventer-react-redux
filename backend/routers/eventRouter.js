const express = require("express");
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const eventController = require('../controllers/eventController')
// const test = require('../controllers/test')

router.post('/', auth, eventController.createEvent)
router.get('/getHomeEvents', eventController.getHomeEvents)
router.get('/getUserEvents/:id', auth, eventController.getUserEvents)
// router.get('/getUserEvents/:id', eventController.getUserEvents)
router.delete('/deleteEvent/:id', auth, eventController.deleteEvent)
router.put('/updateEvent/:id', auth, eventController.updateEvent)

router.get('/getEvent/:id', eventController.getEvent)

router.put('/attendEvent/:id', auth, eventController.attendEvent)

router.put('/unattendEvent/:id', auth, eventController.unattendEvent)

router.post('/uploadPic', eventController.uploadPic)

// router.get('/getAttendingEvents/:id', auth, eventController.getAttendingEvents)
router.get('/getAttendingEvents', eventController.getAttendingEvents)

// router.post('/attendEvent/:id', auth, eventController.attendEvent)

// since we're using JWT tokens loggin out will be handled by one of slice services by just removing user from local storage

module.exports = router