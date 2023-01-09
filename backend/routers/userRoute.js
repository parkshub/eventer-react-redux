const express = require("express");
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/authMiddleware")

router.post("/", userController.registerUser)
router.post("/login",  userController.loginUser)
router.get("/me", auth,  userController.getUser)
router.get("/getUserInfo/:id", auth,  userController.getUserInfo)
router.put("/changeProfile", auth, userController.changeProfile)

module.exports = router