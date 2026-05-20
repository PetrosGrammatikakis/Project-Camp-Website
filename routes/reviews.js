    const express = require('express');
    const router = express.Router({ mergeParams: true });
    const Review = require('../models/review');
    const Campground = require('../models/campground');
    const { reviewSchema } = require('../schema');
    const ExpressError = require('../utils/ExpressError');
    const { isLoggedIn, validateReview, isUserReview } = require('../middleware');
    const { postReview, deleteReview } = require('../controllers/reviews')


    


    // Reviews routes

    router.post('/', isLoggedIn, validateReview, postReview)

    router.delete('/:reviewId', isLoggedIn, isUserReview, deleteReview)

    module.exports = router;
