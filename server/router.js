require('dotenv').config();
const router = require('express').Router();
const processThruPython = require('./getPythonData');

router.post('/', (req, res) => {
  const userEmail = req.body.userEmail || 'test%40test.com' // @ -> %40
  const imageUrlS3 = `${process.env.AWS_S3_BUCKET_IMAGE_URL}/${userEmail}-image.jpg`;

  processThruPython(imageUrlS3)
    .then(data => res.status(200).send(data))
    .catch(err => console.log(err));
});

module.exports = router;