const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require("../middleware/async")
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

//@desc Get all Courses
//@route GET /api/v1/courses
//@route GET /api/v1/courses/:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({
            bootcamp: req.params.bootcampId
        })

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
})


//@desc Get single Courses
//@route GET /api/v1/courses/:id
//@access Public

exports.getCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`), 400)
    }

    res.status(200).json({
        sucess: true,
        data: course
    });

})


//@desc Add Courses
//@route POST /api/v1/bootcamps/:bootcampId/courses
//@access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`no bootcamp with the id of ${req.params.bootcamp}`), 404)

    }

    //make sure user is bootcamp owner and couse creater owner
    //make sure user is the owner and not the admin
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`), 404)

    }


    const course = await Course.create(req.body);
    res.status(201).json({
        sucess: true,
        data: course
    })
})



//@desc Update Courses
//@route PUT /api/v1/courses/:id
//@access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {


    let course = await Course.findById(req.params.id)


    if (!course) {
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`), 404)

    }

    //make sure user is the owner of the couse

    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${course._id}`, 404))
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        sucess: true,
        data: course
    })
})


//@desc Delete Courses
//@route DELETE /api/v1/courses/:id
//@access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`), 404)
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${course._id}`), 404)
    }

    await course.remove()
    res.status(201).json({
        sucess: true,
        data: {}
    })
})
