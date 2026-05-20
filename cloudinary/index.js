const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
  


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOYDINARY_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'ProjectCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }

})

module.exports = { storage, cloudinary }




// async function testUpload() {
//     try {
//         const result = await cloudinary.uploader.upload(
//             "https://res.cloudinary.com/demo/image/upload/sample.jpg",
//             {
//                 folder: "YelpCampTest"
//             }
//         );

//         console.log(" SUCCESS!");
//         console.log(result);

//     } catch (err) {
//         console.log(" ERROR!");
//         console.log(err);
//     }
// }

// testUpload();