const express = require("express")
const { getBootcampsInRadius, getBootcamps, getBootcamp, createBootcamps, updateBootcamps, deleteBootcamps, bootcampPhotoUpload } = require("../controller/bootcamps")

const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResult')

//Include other resource router
const courseRouter = require('./courses')

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.get('/', advancedResults(Bootcamp, 'courses'), getBootcamps)
router.post('/', createBootcamps)
router.get('/:id', getBootcamp)
router.put('/:id', updateBootcamps)
router.delete('/:id', deleteBootcamps)
router.get('/radius/:zipcode/:distance', getBootcampsInRadius)
router.put('/:id/photo', bootcampPhotoUpload)

module.exports = router