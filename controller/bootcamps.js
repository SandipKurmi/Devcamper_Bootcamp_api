const Bootcamp = require('../models/Bootcamp')
const errorResponse =  require('../utile/errorResponse')
//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access Public

exports.getBootcamps =async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find()
        res.status(200).json({
            sucess: true,
            totle: bootcamp.length,
            data: bootcamp

        })
        
    } catch (error) {
        res.status(400).json({sucess: false, data:null})
    }
}


//@desc Get bootcamps by id
//@route GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp =async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return(
                new errorResponse(`bootcamp not found with id ${req.params.id}`, 404)
            )
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        // res.status(400).json({sucess: false, data:null})
        next(error)
    }
}


//@desc create new bootcamps
//@route POST /api/v1/bootcamps/:id
//@access Public
exports.createBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)
        console.log(bootcamp);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        res.status(400).json({
            sucess: false,
            data:null
        })
    }
}


//@desc Update bootcamps
//@route UPDATE /api/v1/bootcamps/:id
//@access Public
exports.updateBootcamps =async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id , req.body, {new:true})

        if(!bootcamp){
            return res.status(400).json({sucess:false, data:null});
        }

        res.status(200).json({
            sucess: true,
            data: bootcamp
        })

    } catch (error) {
         res.status(400).json({
            sucess: false,
            data:null
        })
    }
}


//@desc Delete bootcamps
//@route DELETE /api/v1/bootcamps/:id
//@access Public
exports.deleteBootcamps = async (req, res, next) => {
   try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if(!bootcamp){
        return(
            res.status(400).json({
                sucess: false,
                data:null
            }) 
        )
    }
    res.status(200).json({
        sucess : true,
        message: "the bootcamp data by id is deleted",
        data: bootcamp
    })
    
   } catch (error) {
    res.status(400).json({
        sucess: false,
        data:null
    })
   }
}