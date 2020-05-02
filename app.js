/*eslint-env es6*/
const express = require('express');
const bodyParser = require('body-parser');
// const { PythonShell } = require('python-shell');
// const multer = require('multer');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Mini Hospital API 2'));

app.listen(port, () => console.log(`Example app listening on port ${port}! ${__dirname}`));

// python3 predict.py '/home/ubuntu18/Documents/My/00 PROJECTS/4rth YEAR PROJECT/mini-hospital-api/python-scripts/bone-fracture-detection/bone.png'
