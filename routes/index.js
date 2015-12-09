var express = require('express');
var router = express.Router();

var coordinates = [];

/* GET home page. */
router.get('/:token', function(req, res) {
    res.render('index', {coordinates: coordinates});
});

router.get('/:token/addCoordinate', function(req) {
    coordinates.push({
        lat: req.query.lat,
        lng: req.query.lng
    });
});

module.exports = router;