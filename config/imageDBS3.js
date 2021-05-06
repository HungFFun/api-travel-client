var AWS = require("aws-sdk");
const axios = require('axios').default;
const FileType = require('file-type');
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

const uploadImages = async(avatar) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: avatar.name,
        Body: avatar.data,
        ACL: "public-read",
    };
    return await (await s3.upload(params).promise()).Location
}

async function uploadAttachmentToS3(type, buffer,key) {
    var params = {
     //file name you can get from URL or in any other way, you could then pass it as parameter to the function for example if necessary
      Key : 'keey.png', 
      Body : buffer,
      Bucket : BUCKET_NAME,
      ContentType : type,
      ACL: 'public-read' //becomes a public URL
    }
    //notice use of the upload function, not the putObject function
    return s3.upload(params).promise().then((response) => {
      return response.Location
    }, (err) => {
      return {type: 'error', err: err}
    })
  }

async function downloadAttachment(url,key) {
    return axios.get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      const buffer = Buffer.from(response.data, 'base64');
      return (async () => {
        let type = (await FileType.fromBuffer(buffer)).mime
        return uploadAttachmentToS3(type, buffer,key)
      })();
    })
    .catch(err => {
      return {type: 'error', err: err}
    });  
  }
module.exports = {
    uploadImages: uploadImages,
    downloadAttachment : downloadAttachment
}