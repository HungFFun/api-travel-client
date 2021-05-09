var AWS = require("aws-sdk");
const BUCKET_NAME = 'tumblrz';
require('dotenv').config()
AWS.config.update({

    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const uploadImages = async (avatar) => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: avatar.name,
            Body: avatar.data,
            ACL: "public-read",
        };
        return await (await s3.upload(params).promise()).Location
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    uploadImages: uploadImages,
}