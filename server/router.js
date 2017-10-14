const router = require('express').Router();
const runDarknet = require('./runDarknet');

router.post('/', (req, res) => {
  
  if (req.body.userEmail && !req.body.userEmail.includes('@')) {
    console.log('router invalid email');
    return res.sendStatus(404);
  }
  if (req.body.yoloType && !req.body.yoloType.includes('simple') && !req.body.yoloType.includes('funny')) {
    console.log('router invalid yoloType');
    return res.sendStatus(404);
  } 

  const userEmail = req.body.userEmail || 'test@test.com'; // @ -> %40
  const yoloType = req.body.yoloType || 'funny'; // simple or funny

  runDarknet(userEmail, yoloType)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(404).send(`runDarknet error: ${err}`));
});

module.exports = router;