const asyncHandler = require("../middleware/async")
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp');

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.find()
    res.status(200).json({
        sucess: true,
        totle: bootcamp.length,
        data: bootcamp
    })
})


//@desc Get bootcamps by id
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return (
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        )
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})


//@desc create new bootcamps
//@route POST /api/v1/bootcamps/:id
//@access Public
exports.createBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data: bootcamp
    })
});


//@desc Update bootcamps
//@route UPDATE /api/v1/bootcamps/:id
//@access Public
exports.updateBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!bootcamp) {

        return (
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        )
    }
    res.status(200).json({
        sucess: true,
        data: bootcamp
    })


})


//@desc Delete bootcamps
//@route DELETE /api/v1/bootcamps/:id
//@access Public
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        return (
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        )
    }
    res.status(200).json({
        sucess: true,
        message: "the bootcamp data by id is deleted",
        data: bootcamp
    })

})