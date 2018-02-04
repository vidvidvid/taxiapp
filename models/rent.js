var mongoose = require('mongoose');

//Shema za taksi
var rentSchema = mongoose.Schema({
    taxi_id: {
        type: String,
        require: true
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    company: {
        type: String
    },
    length: {
        type: Number,
        require: true
    },
    date: {
        type: String,
        require: true,
        default: Date()
    },
    price: {
        type: Number,
        
    },
});

// Rent objekt bo povsod dostopen
var Rent = module.exports = mongoose.model('Rent', rentSchema);

// Get Taxies
module.exports.getRents = function(callback, limit){
    Rent.find(callback).limit(limit);
};

// get one by ID
module.exports.getRentById = function(id, callback){
    Rent.findById(id, callback);
}

// add a rent
module.exports.addRent = function(rent, callback){
    Rent.create(rent, callback);
}

// remove a rent
module.exports.deleteRent = function(id, callback){ //taxi = objekt iz forme
    var query = {_id: id};
    Rent.remove(query, callback);
};