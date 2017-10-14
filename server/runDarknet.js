require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const downloadS3 = require('./downloadS3');
const formatToUsableData = require('./formatToUsableData');
const getImageSize = require('./getImageSize');

const runDarknet = (userEmail, yoloType) =>
  new Promise((resolve, reject) => {
    const imageUrlS3 = `${process.env.AWS_S3_BUCKET_IMAGE_URL}/${userEmail}-image.jpg`;
    let execStatement = null;
    
    //choose one of these. -thresh .5 means detect object above 50% accuracy.
    const tinyYolo = `./darknet detector test cfg/voc.data cfg/tiny-yolo-voc.cfg tiny-yolo-voc.weights ${userEmail}-super.jpg -thresh .5`;
    const yolo2 = `./darknet detect cfg/yolo.cfg yolo.weights ${userEmail}-super.jpg -thresh .5`;
    const yolo9000 = `./darknet detector test cfg/combine9k.data cfg/yolo9000.cfg yolo9000.weights ${userEmail}-super.jpg -thresh .5`;
    
    switch (yoloType) {
      case 'simple':
        downloadS3(imageUrlS3, `./darknet/${userEmail}-super.jpg`, () => console.log('download complete'));
        execStatement = tinyYolo;
        break;
      case 'funny':
        downloadS3(imageUrlS3, `./darknet/${userEmail}-super.jpg`, () => console.log('download complete'));
        execStatement = yolo9000;
        break;
      default:
        console.log('runDarknet invalid yoloType');
    }

    if (!execStatement) {
      reject();
    }

    getImageSize(imageUrlS3)
      .then((imageSize) => {
        const dark = exec(execStatement, {
          cwd: path.join(__dirname, './darknet'),
        });
  
        let labelData;
        dark.stdout.on('data', (data) => {
          labelData = formatToUsableData(data.toString('utf8'), imageSize);
        }).on('end', () => {
          resolve(labelData);
          reject('stdout was rejected');
        });
        // // for debugging darknet 
        // dark.stderr.on('data', (data) => {
        //   console.log(`stderr: ${data}`);
        // })
      });
  });

module.exports = runDarknet;