/*eslint-env es6*/
const express = require('express');
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');
const multer = require('multer');
// const DelayedResponse = require('http-delayed-response');

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
const extendTimeoutMiddleware = (req, res, next) => {
    const space = ' ';
    let isFinished = false;
    let isDataSent = false;

    // Only extend the timeout for API requests
    if (!req.url.includes('/api')) {
        next();
        return;
    }

    res.once('finish', () => {
        isFinished = true;
    });

    res.once('end', () => {
        isFinished = true;
    });

    res.once('close', () => {
        isFinished = true;
    });

    res.on('data', (data) => {
        // Look for something other than our blank space to indicate that real
        // data is now being sent back to the client.
        if (data !== space) {
            isDataSent = true;
        }
    });

    const waitAndSend = () => {
        setTimeout(() => {
            // If the response hasn't finished and hasn't sent any data back....
            if (!isFinished && !isDataSent) {
                // Need to write the status code/headers if they haven't been sent yet.
                if (!res.headersSent) {
                    res.writeHead(202);
                }

                res.write(space);

                // Wait another 15 seconds
                waitAndSend();
            }
        }, 15000);
    };

    waitAndSend();
    next();
};

app.use(extendTimeoutMiddleware);

app.post('/brain', (req, res) => {
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
            console.log(data);
            res.send(data)
        });
    });
});

app.post('/bone', (req, res) => {
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
            console.log(data);
            res.send(data)
        });
    });
});

app.get('/', (req, res) => res.send('Mini Hospital API'));

// app.post('/post', function (req, res) {
//   upload(req, res, function (err) {
//     if (err) {
//       console.log(err);
//       return res.status(422).send("an Error occured")
//     }
//     return res.send("Upload Completed for " + req.file.path);
//   });
// })
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

// python3 predict.py '/home/ubuntu18/Documents/My/00 PROJECTS/4rth YEAR PROJECT/mini-hospital-api/python-scripts/bone-fracture-detection/bone.png'


