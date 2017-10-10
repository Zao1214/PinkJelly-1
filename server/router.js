const router = require('express').Router();
const runDarknet = require('./runDarknet');

router.post('/', (req, res) => {
  let reqBodyTest = true;
  
  if (req.body.userEmail) {
    if (!req.body.userEmail.includes('@')) {
      reqBodyTest = false;
      console.log('router invalid email');
    }
  }
  if (req.body.yoloType) {
    if (!req.body.yoloType.includes('simple') && !req.body.yoloType.includes('funny')) {
      reqBodyTest = false;
      console.log('router invalid yoloType');
    }
  } 

  if (reqBodyTest) {
    const userEmail = req.body.userEmail || 'test@test.com'; // @ -> %40
    const yoloType = req.body.yoloType || 'funny'; // simple or funny
  
    runDarknet(userEmail, yoloType)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(404).send(`runDarknet error: ${err}`));
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;