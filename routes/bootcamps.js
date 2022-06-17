const express = require("express")
const { getBootcampsInRadius, getBootcamps, getBootcamp, createBootcamps, updateBootcamps, deleteBootcamps } = require("../controller/bootcamps")
//Include other resource router
const courseRouter = require('./courses')

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.get('/', getBootcamps)
router.post('/', createBootcamps)
router.get('/:id', getBootcamp)
router.put('/:id', updateBootcamps)
router.delete('/:id', deleteBootcamps)
router.get('/radius/:zipcode/:distance', getBootcampsInRadius)

module.exports = router