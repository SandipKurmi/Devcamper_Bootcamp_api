const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require("../middleware/async")
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
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

    //Add user to req,body
    req.body.user = req.user.id;

    //check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })



    //if the user is not admin they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with Id ${req.user.id} has already published a bootcamp`, 400))
    }

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

    let bootcamp = await Bootcamp.findById(req.params.id)

    // console.log(bootcamp)
    if (!bootcamp) {
        return (
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        )
    }

    // //make sure user is bootcamp owner
    // //make sure user is the owner and not the admin
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return (
            next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcomp`, 404))
        )
    }
    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, { new: true });


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

    //make sure user is bootcamp owner
    //make sure user is the owner and not the admin
    console.log((bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'))
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return (
            next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcomp`, 404))
        )
    }

    bootcamp.remove();
    res.status(200).json({
        sucess: true,
        message: "the bootcamp data by id is deleted",
        data: {}
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


//@desc Upload photo for bootcamps
//@route PUT /api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return (
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        )
    }

    if (!req.files) {
        return (
            next(new ErrorResponse(`Please upload a file`, 400))
        )
    }

    const file = req.files.file;

    //Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return (
            next(new ErrorResponse(`Please upload an image file`, 400))
        )
    }

    //Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return (
            next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
        )
    }

    //Creat custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return (
                next(new ErrorResponse(`Problem with file upload`, 500))
            )
        }

        // await Bootcamp.findByIdAndUpdate(req.param.id, {
        //     photo: file.name
        // });

        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        }, { new: true })


        res.status(200).json({
            sucess: true,
            data: bootcamp
        })
    })
})
