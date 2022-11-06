const express = require("express");
const router = express.Router()
const {registerUser, loginUser, getUser} = require('../controllers/userController')
const auth = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', auth, getUser)
// since we're using JWT tokens loggin out will be handled by one of slice services by just removing user from local storage

module.exports = router