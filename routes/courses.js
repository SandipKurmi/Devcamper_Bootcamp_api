const express = require("express")
const { getCourses, addCourse, getCourse, updateCourse, deleteCourse } = require("../controller/courses")
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth')


const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResult')

router.get('/', advancedResults(Course, {
    path: "bootcamp",
    select: "name description website"
}), getCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('publisher', 'admin'), addCourse);
router.put('/:id', protect, authorize('publisher', 'admin'), updateCourse)
router.delete('/:id', protect, authorize('publisher', 'admin'), deleteCourse)


module.exports = router