var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

Taxi = require('./models/taxi');

//Connect to Mongoose
mongoose.connect('mongodb://localhost/taxiapp');
var db = mongoose.connection;

// Route for the landing page
app.get('/', function (req, res) {
    res.send('Ola taxi brother man!');
});


// -------------------------------
// TAXIES
// -------------------------------

// get all taxies
app.get('/api/taxies', function (req, res) {
    Taxi.getTaxies(function (err, taxies) {
        if (err) throw err;
        res.json(taxies);
    });
})

// create a taxi
app.post('/api/taxies', function (req, res) {
    var taxi = req.body;
    Taxi.addTaxi(taxi, function (err, taxi) {
        if (err) throw err;
        res.json(taxi);
    });
})

// get one taxi
app.get('/api/taxies/:_id', function (req, res) {
    Taxi.getTaxiById(req.params._id, function (err, taxi) {
        if (err) throw err;
        res.json(taxi);
    });
})

// update a taxi
app.put('/api/taxies/:_id', function (req, res) {
    var id = req.params._id; // v db je '_id'
    var taxi = req.body;
    Taxi.updateTaxi(id, taxi, {}, function (err, taxi) {
        if (err) throw err;
        res.json(taxi);
    });
})

// delete a taxi
app.delete('/api/taxies/:_id', function (req, res) {
    var id = req.params._id; // v db je '_id'
    Taxi.deleteTaxi(id, function (err, taxi) {
        if (err) throw err;
        res.json(taxi);
    });
})

app.listen(3000);
console.log('App running on port 3000')