/*eslint-env es6*/
const express = require('express');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');
const multer = require('multer');
let nearbyHospitals = require('./nearby-hospitals');


const extendTimeOutFunction = require('./middlewares/extendTimeOut');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(extendTimeOutFunction);

app.post('/api/brain', (req, res) => {
    const brain_path = __dirname + '/python-scripts/brain-tumor-detection';
    const upload = multer({ dest: brain_path + '/data/' }).single('photo');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        const options = {
            args:
                [
                    req.file.path,
                    brain_path + '/cnn-parameters-improvement-23-0.91.model'
                ]
        }
        console.log("------>", options);
        PythonShell.run(brain_path + '/predict.py', options, function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            console.log(JSON.stringify(data));
            res.write(JSON.stringify(data));
            res.end();
        });
    });
});

app.post('/api/bone', (req, res) => {
    const bone_path = __dirname + '/python-scripts/bone-fracture-detection';
    const upload = multer({ dest: bone_path + '/data/' }).single('photo');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        var options = {
            args:
                [
                    req.file.path,
                    bone_path + '/model.h5'
                ]
        }
        console.log("------>", options);
        PythonShell.run(bone_path + '/predict.py', options, function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            console.log(JSON.stringify(data));
            res.write(JSON.stringify(data));
            res.end();
        });
    });
});

app.post('/api/disease', (req, res) => {
    const disease_path = __dirname + '/python-scripts/disease-detection';
    console.log(req.body.symptopms);
    const symps = req.body.symptopms;
    console.log(symps);
    var options = {
        args:
            [
                disease_path + '/disease_dt_model.sav',
                ...symps
            ]
    }
    console.log("------>", options);
    PythonShell.run(disease_path + '/predict.py', options, function (err, data) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        console.log(JSON.stringify(data));
        res.write(JSON.stringify(data));
        res.end();
    });
});

app.post('/api/nearby-hospitals', (req, res) => {
    console.log(req.body);
    nearbyHospitals.nbHospitals(req, res);
});


// testing endpoints

app.get('/', (req, res) => res.send('Mini Hospital API Route is /'));
app.get('/api', (req, res) => res.send('Mini Hospital API Route is /api'));

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
