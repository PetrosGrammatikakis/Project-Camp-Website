const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');




main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/project-camp');
    console.log('Database connected');
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            user: "6a0c4ce0d187a5ad453458cb", //make a user and take the id from the mongosh or the mongodb i used it so you can edit and edit all the new camps
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, eaque.',
            images: {
                url: 'https://res.cloudinary.com/do71ozwtk/image/upload/v1779113918/YelpCamp/k5jzgw385cebveulyxqw.png',//this is a example type your cloudinary img url her
                filename: 'YelpCamp/k5jzgw385cebveulyxqw'// and Public id of the img click on the img on your cloudinary and you will see it down right
            },
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },

        })
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});