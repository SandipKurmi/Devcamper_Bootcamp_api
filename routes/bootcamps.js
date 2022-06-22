const express = require("express")
const { getBootcampsInRadius, getBootcamps, getBootcamp, createBootcamps, updateBootcamps, deleteBootcamps, bootcampPhotoUpload } = require("../controller/bootcamps")

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResult')

//Include other resource router
const courseRouter = require('./courses')
const reviewRouter = require('./reviews')

const router = express.Router();
const { protect, authorize } = require('../middleware/auth')

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)


router.get('/', advancedResults(Bootcamp, 'courses'), getBootcamps)
router.post('/', protect, authorize('publisher', 'admin'), createBootcamps)
router.get('/:id', getBootcamp)
router.put('/:id', protect, authorize('publisher', 'admin'), updateBootcamps)
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteBootcamps)
router.get('/radius/:zipcode/:distance', getBootcampsInRadius)
router.put('/:id/photo', protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

module.exports = router