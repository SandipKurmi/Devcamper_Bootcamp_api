const Bootcamp = require('../models/Bootcamp')

//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public

exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "see all bootcamps", })
}


//@desc Get bootcamps by id
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: `see one bootcamps with id: ${req.params.id}` })

}


//@desc create new bootcamps
//@route POST /api/v1/bootcamps/:id
//@access Public
exports.createBootcamps = async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
        success: true,
        data: bootcamp
    })
}


//@desc Update bootcamps
//@route UPDATE /api/v1/bootcamps/:id
//@access Public
exports.updateBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: `bootcamp is updated with id: ${req.params.id} ` })
}


//@desc Delete bootcamps
//@route DELETE /api/v1/bootcamps/:id
//@access Public
exports.deleteBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: `bootcamp with id: ${req.params.id} deleted` })
}