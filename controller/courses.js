const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require("../middleware/async")
const Course = require('../models/Course');

//@desc Get all Courses
//@route GET /api/v1/courses
//@route GET /api/v1/courses/:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    console.log(req.params)
    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        })
    } else {
        query = Course.find().populate({
            path: "bootcamp",
            select: "name description"
        });
    }
    const course = await query;

    res.status(200).json({
        sucess: true,
        count: course.length,
        data: course
    });

})

exports.createCourses = asyncHandler(async (req, res, next) => {
    const course = await Course.create(req.body)
    res.status(201).json({
        sucess: true,
        data: course
    })
})