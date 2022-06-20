//create  express server
const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
dotenv.config({ path: "./config/config.env" });

//conect to database
connectDB()

const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require('./routes/auth')
const app = express();

//Body parser
app.use(express.json())
app.use(morgan("dev"))

// File uploading

app.use(fileupload())

//set static folder
app.use(express.static(path.join(__dirname, 'public')))


//moutn routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
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