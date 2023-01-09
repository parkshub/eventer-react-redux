const express = require("express");
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/authMiddleware")

router.post("/", userController.registerUser)
router.post("/login",  userController.loginUser)
router.get("/me", auth,  userController.getUser)

router.get("/getUserInfo/:id", auth,  userController.getUserInfo)

router.put("/changeProfile", auth, userController.changeProfile)

router.get("/test/:id", userController.test)
// since we"re using JWT tokens loggin out will be handled by one of slice services by just removing user from local storage

module.exports = router