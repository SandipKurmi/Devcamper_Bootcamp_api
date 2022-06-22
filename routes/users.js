const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controller/users')
const User = require('../models/User');
const router = express.Router({ mergeParams: true })



const advancedResults = require('../middleware/advancedResult');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));


router.get('/', advancedResults(User), getUsers);

router.post('/', createUser);
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)




module.exports = router;