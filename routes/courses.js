const express = require("express")
const { getCourses, addCourse, getCourse, updateCourse, deleteCourse } = require("../controller/courses")
const router = express.Router({ mergeParams: true });

const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResult')

router.get('/', advancedResults(Course, {
    path: "bootcamp",
    select: "name description website"
}), getCourses);
router.get('/:id', getCourse);
router.post('/', addCourse);
router.put('/:id', updateCourse)
router.delete('/:id', deleteCourse)


module.exports = router