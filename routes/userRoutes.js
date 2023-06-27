const express = require('express')
const { getAllUsers, registerUser, loginUser } = require('../controllers/userController')

//router object
const router = express.Router()

router.get('/all-users', getAllUsers)
router.post('/register', registerUser)
router.post('/login', loginUser)

module.exports = router