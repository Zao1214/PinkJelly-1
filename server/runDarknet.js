require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const downloadS3 = require('./downloadS3');
const beautifyData = require('./beautifyData');
const getImageSize = require('./getImageSize');

const runDarknet = (userEmail, yoloType) =>
  new Promise((resolve, reject) => {
    const imageUrlS3 = `${process.env.AWS_S3_BUCKET_IMAGE_URL}/${userEmail}-image.jpg`;
    let execStatement = null;
    
    switch (yoloType) {
      case 'simple':
        downloadS3(imageUrlS3, `./darknet/${userEmail}-super.jpg`, () => console.log('download complete'));
        execStatement = `./darknet detect cfg/yolo.cfg yolo.weights ${userEmail}-super.jpg -thresh .5`;
        break;
      case 'funny':
        downloadS3(imageUrlS3, `./darknet/${userEmail}-super.jpg`, () => console.log('download complete'));
        execStatement = `./darknet detector test cfg/combine9k.data cfg/yolo9000.cfg yolo9000.weights ${userEmail}-super.jpg -thresh .5`;
        break;
      default:
        console.log('runDarknet invalid yoloType');
    }

    if (execStatement) {  
      getImageSize(imageUrlS3)
        .then((imageSize) => {
          const dark = exec(execStatement, {
            cwd: path.join(__dirname, './darknet'),
          });
    
          let labelData;
          dark.stdout.on('data', (data) => {
            labelData = beautifyData(data.toString('utf8'), imageSize);
          }).on('end', () => {
            resolve(labelData);
            reject('stdout was rejected');
          });
          //// for debugging darknet 
          // dark.stderr.on('data', (data) => {
          //   console.log(`stderr: ${data}`);
          // })
        });
    } else {
      reject();
    }
  });

module.exports = runDarknet;