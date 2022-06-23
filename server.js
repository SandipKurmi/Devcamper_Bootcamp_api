//create  express server
const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
var xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
var cors = require('cors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
dotenv.config({ path: "./config/config.env" });

//conect to database
connectDB()

const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const app = express();

//Body parser
app.use(express.json())


//Cookie parser
app.use(cookieParser())

//dev loging middlewarre
app.use(morgan("dev"))

// File uploading  
app.use(fileupload())

//Sanitize data
// To remove data using these defaults:
app.use(mongoSanitize());

//set Security headers
app.use(helmet());

//Prevent xss attacked
app.use(xss())

//rate limitin
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

//prevent http param pollution
app.use(hpp())

//Enable CORS
app.use(cors())


//set static folder 
app.use(express.static(path.join(__dirname, 'public')))


//moutn routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, console.log(`Server is running on port ${PORT}`.yellow.bold));

//Handle unhandled pormise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    //close server & exit process
    server.close(() => {
        process.exit(1)
    })
})