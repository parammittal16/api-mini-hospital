/*eslint-env es6*/
exports.nbHospitals = function (req, res) {

    var key = req.body.mapsKey || "AIzaSyAMVgdU4VeJ9zjOYjAPvfRBEj1k95j-axA";
    var location = encodeURIComponent(`${req.body.latitude},${req.body.longitude}`);
    var sensor = false;
    var types = "hospital";
    var keyword = "hospital";

    var https = require('https');
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + "key=" + key + "&location=" + location + "&rankby=distance" + "&sensor=" + sensor + "&types=" + types + "&keyword=" + keyword;
    console.log(url);
    https.get(url, function (response) {
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {
            var places = JSON.parse(body);
            var locations = places.results;
            var randLoc = locations[Math.floor(Math.random() * locations.length)];

            console.log(places)
            res.write(JSON.stringify(places));
            res.end();
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
        res.write(JSON.stringify(e.message));
        res.end();
    });
};
