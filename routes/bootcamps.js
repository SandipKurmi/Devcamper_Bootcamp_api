const express = require("express")
const { getBootcamps, getBootcamp, createBootcamps, updateBootcamps, deleteBootcamps } = require("../controller/bootcamps")
const router = express.Router();

router.get('/', getBootcamps)
router.post('/', createBootcamps)
router.get('/:id', getBootcamp)
router.put('/:id', updateBootcamps)
router.delete('/:id', deleteBootcamps)

module.exports = router