const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require("../middleware/async")
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    let query;

    //Copy req.query
    const reqQuery = { ...req.query }
    console.log(reqQuery);

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    //Create query string
    let quaryStr = JSON.stringify(reqQuery)

    //Create operators ($gt, $gte, etc)
    quaryStr = quaryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //Finding resorce
    query = Bootcamp.find(JSON.parse(quaryStr)).populate('courses');

    //select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)

    }

    //Sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    console.log(page)
    const limit = parseInt(req.query.limit, 10) || 10;
    console.log(limit)
    const startIndex = (page - 1) * limit;
    console.log(startIndex)
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit);
    // console.log(query);

    //Executinig query
    const bootcamp = await query

    //Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        sucess: true,
        totle: bootcamp.length,
        pagination,
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

    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return (
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        )
    }

    bootcamp.remove();
    res.status(200).json({
        sucess: true,
        message: "the bootcamp data by id is deleted",
        data: bootcamp
    })

})

//@desc Get bootcamps within a radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

    console.log(req.params);
    const { zipcode, distance } = req.params;
    console.log(zipcode)
    console.log(distance)

    //Get lat/lng from geocoder

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;


    //calc radius using radians
    //divide dist by radius of earth
    //Earth radius = 3,963 mi / 6,378 km

    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        sucess: true,
        count: bootcamps.length,
        data: bootcamps
    })

})