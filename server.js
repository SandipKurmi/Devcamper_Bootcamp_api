//create  express server
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: "./config/config.env" });
const app = express();
const bodyParser = require('body-parser');


app.post('/api/v1/bootcamps', (req, res) => {
    res.status(201).json({ success: true, msg: "bootcamps is created" });
})


app.get('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({ success: true, msg: "see all bootcamps" })
})

app.get('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({ success: true, msg: `see one bootcamps with id: ${req.params.id}` })
})

app.put('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({ success: true, msg: `bootcamp is updated with id: ${req.params.id} ` })
})


app.delete('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({ success: true, msg: `bootcamp with id: ${req.params.id} deleted` })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));