require('dotenv').config();
const fs = require('fs');
const request = require('request');

const downloadS3 = (uri, fileName, callBack) => {
  if (!uri.includes(process.env.AWS_S3_BUCKET_IMAGE_URL)) {
    return 'downloadS3 invalid uri';
  } 
  if (!fileName.includes('./darknet/')) {
    return 'downloadS3 invalid filename';
  }

  request.head(uri, (err) => {
    if (err) {
      console.log('download failed');
    }
    
    request(uri).pipe(fs.createWriteStream(fileName)).on('close', callBack);
  });
};

module.exports = downloadS3;