const express = require('express');
const { register, 
        login, 
        logout,
        getMe, 
        forgotPassword, 
        resetPassword,
        updateDetails,
        updatepassword,
     } = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.put('/logout',logout);
router.get('/me',protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatepassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);



module.exports = router;