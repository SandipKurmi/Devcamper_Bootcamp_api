const express = require("express")
const { getCourses, createCourses } = require("../controller/courses")
const router = express.Router({ mergeParams: true });

router.get('/', getCourses)
router.post('/', createCourses)


module.exports = router