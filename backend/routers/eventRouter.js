const express = require("express");
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const eventController = require("../controllers/eventController")

router.post("/", auth, eventController.createEvent)
router.get("/getHomeEvents", eventController.getHomeEvents)
router.get("/getEvent/:id", eventController.getEvent)
router.get("/getUserEvents", auth, eventController.getUserEvents) 
router.get("/getAttendingEvents", auth, eventController.getAttendingEvents)
router.get("/getProfileEvents/:id", auth, eventController.getProfileEvents)
router.get("/getAllEvents", eventController.getAllEvents)
router.put("/updateEvent/:id", auth, eventController.updateEvent)
router.put("/attendEvent/:id", auth, eventController.attendEvent)
router.put("/unattendEvent/:id", auth, eventController.unattendEvent)
router.delete("/deleteEvent/:id", auth, eventController.deleteEvent)

module.exports = router