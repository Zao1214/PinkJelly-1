require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const router = require('./router');

const port = process.env.PORT || 7080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

app.listen(port, () => console.log(`server listen ${port}`));

module.exports = app;