const express = require("express");
const { 
    getBootcamps, 
    getBootcamp,
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamp");

const Bootcamp= require("../models/Bootcamp");
const advancedResults = require("../middleware/advancedResults");


//==============Include other resources routers============================//
const courseRouter = require("./courses");

// Initialsing router
const router = express.Router();

// require protect
const { protect } = require("../middleware/auth");

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);


// ======================== Routes ================================//

router.route("/radius/:zipcode/:distance")
        .get(getBootcampsInRadius);


router.route("/:id/photo")
                .put(protect, bootcampPhotoUpload);

router.route("/")
        .get(advancedResults(Bootcamp, 'courses') ,getBootcamps)
        .post(protect, createBootcamp);

router.route("/:id")
        .get(getBootcamp)
        .put(protect, updateBootcamp)
        .delete(protect, deleteBootcamp);
        



// Exporting
module.exports = router;