const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isUser, validateCampground } = require('../middleware');
const { index, newCampPage, newCamp, showCamp, editCamp, updateCamp, deleteCamp } = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })






// Campgrounds routes
router.route('/')
    .get(index)
    .post(isLoggedIn, upload.array('images'), validateCampground, newCamp)


router.get('/new', isLoggedIn, newCampPage);



router.route('/:id')
    .get(showCamp)
    .put(isLoggedIn, isUser,upload.array('images'), validateCampground, updateCamp)
    .delete(isLoggedIn, isUser, deleteCamp)


router.get('/:id/edit', isLoggedIn, isUser, editCamp)




module.exports = router;