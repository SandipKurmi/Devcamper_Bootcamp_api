//create  express server
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
dotenv.config({ path: "./config/config.env" });

//conect to database
connectDB()

const bootcamps = require("./routes/bootcamps")
const app = express();

//Body parser
app.use(express.json())



app.use(morgan("dev"))

//moutn routers
app.use('/api/v1/bootcamps', bootcamps)





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