/*eslint-env es6*/
const express = require('express');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');
// const multer = require('multer');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/sample', (req, res) => {
    var options = {
        args:
            [
                req.query.funds, // starting funds
                req.query.size, // (initial) wager size
                req.query.count, // wager count — number of wagers per sim
                req.query.sims // number of simulations
            ]
    }
    console.log("------>", options);
    PythonShell.run('./python-scripts/sample.py', options, function (err, data) {
        if (err) res.send(err);
        console.log(data.toString());
        res.send(data.toString())
    });
});

app.get('/', (req, res) => res.send('Mini Hospital API 2'));

app.listen(port, () => console.log(`Example app listening on port ${port}! ${__dirname}`));

// python3 predict.py '/home/ubuntu18/Documents/My/00 PROJECTS/4rth YEAR PROJECT/mini-hospital-api/python-scripts/bone-fracture-detection/bone.png'
