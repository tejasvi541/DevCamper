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


//==============Include other resources routers============================//
const courseRouter = require("./courses");

// Initialsing router
const router = express.Router();

// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter);


// ======================== Routes ================================//

router.route("/radius/:zipcode/:distance")
        .get(getBootcampsInRadius);


router.route("/:id/photo")
                .put(bootcampPhotoUpload);

router.route("/")
        .get(getBootcamps)
        .post(createBootcamp);

router.route("/:id")
        .get(getBootcamp)
        .put(updateBootcamp)
        .delete(deleteBootcamp);
        



// Exporting
module.exports = router;