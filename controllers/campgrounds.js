const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema } = require('../schema');
const { cloudinary } = require('../cloudinary')


const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.newCampPage = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.newCamp = async (req, res) => {



    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }

    const newCampground = new Campground(req.body.campground);


    newCampground.geometry = geoData.features[0].geometry;
    newCampground.location = geoData.features[0].place_name;

    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampground.user = req.user._id;
    await newCampground.save();
    console.log(newCampground)
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'user' } }).populate('user');

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;



    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/campgrounds/${id}/edit`);
    }


    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });


    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...imgs);
    await campground.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}