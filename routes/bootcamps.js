const express = require("express");
const { 
    getBootcamps, 
    getBootcamp,
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius
} = require("../controllers/bootcamp");

const router = express.Router();


// ======================== Routes ================================//

router.route("/radius/:zipcode/:distance")
        .get(getBootcampsInRadius);


router.route("/")
        .get(getBootcamps)
        .post(createBootcamp);

router.route("/:id")
        .get(getBootcamp)
        .put(updateBootcamp)
        .delete(deleteBootcamp);
        



// Exporting
module.exports = router;