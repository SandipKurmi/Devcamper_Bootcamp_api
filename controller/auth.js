const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const User = require('../models/User')



//@desc Register user
//@route Post /api/v1/auth/register
//@access Public

exports.register = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const { name, email, role, password } = req.body;

    //Create user
    const user = await User.create({
        name, email, role, password
    });

    //CREATE TOKEN
    const token = user.getSignedJwtToken();

    res.status(200).json({
        sucess: true,
        token: token
    })
})

//@desc Loging user
//@route Post /api/v1/auth/login
//@access Public

exports.login = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    //check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('invalid credentials', 401))

    }




    //CREATE TOKEN
    const token = user.getSignedJwtToken();

    res.status(200).json({
        sucess: true,
        token: token
    })
})