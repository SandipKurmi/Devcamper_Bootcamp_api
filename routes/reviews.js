const express = require("express")
const { getReviews, getReview, addReview, updateReview, deleteReview } = require("../controller/reviews")

const Review = require('../models/Review')
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth')



const advancedResults = require('../middleware/advancedResult')

router.get('/', advancedResults(Review, {
    path: "bootcamp",
    select: "name description website"
}), getReviews);
router.post('/', protect, authorize('user', 'admin'), addReview)
router.get('/:id', getReview)
router.put('/:id', protect, authorize('user', 'admin'), updateReview)
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview)




module.exports = router