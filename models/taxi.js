var mongoose = require('mongoose');

//Shema za taksi
var taxiSchema = mongoose.Schema({
    drivable: {
        type: Boolean,
        require: true,
        default: true
    },
    year: {
        type: Number,
        require: true,
        default: function(){
            return Math.floor(Math.random()*13+1995);
        }
    },
    max_p: {
        type: Number,
        require: true,
        default: function(){
            return Math.floor(Math.random()*5+1);
        }
    },
    max_s: {
        type: Number,
        require: true,
        default: function(){
            return Math.floor(Math.random()*90+150);
        }
    },
    photo_url: { //random taxi photo
        type: String,
        require: true
        /*default: function(){ 
            return Math.floor(Math.random()*18+1990);
        }*/
    },
    name: { //random iz nekega arraya
        type: String,
        require: true
        /*default: function(){
            return Math.floor(Math.random()*18+1990);
        }*/
    },
    available: { //random iz nekega arraya
        type: Boolean,
        require: true,
        default: true
    },
    sum: {
        type: Number,
        require: true,
        default: 0
    },
    history: {
        type: Array,
        require: true,
        default: []
    }
});

// Taxi objekt bo povsod dostopen
var Taxi = module.exports = mongoose.model('Taxi', taxiSchema);

// Taxies methods

// get all
module.exports.getTaxies = function(callback, limit){
    Taxi.find(callback).limit(limit);
};

// find one
module.exports.getTaxiById = function(id, callback){
    Taxi.findById(id, callback);
};

// create a taxi
module.exports.addTaxi = function(taxi, callback){ //taxi = objekt iz forme
    Taxi.create(taxi, callback);
};

// update a taxi
module.exports.updateTaxi = function(id, taxi, options, callback){ //taxi = nov objekt iz forme
    var query = {_id: id};
    var update = {
        drivable: taxi.drivable,
        year: taxi.year,
        max_p: taxi.max_p,
        max_s: taxi.max_s,
        sum: taxi.sum,
        photo_url: taxi.photo_url,
        history: taxi.history,
        name: taxi.name,
        available: taxi.available
    }
    Taxi.findOneAndUpdate(query, update, options, callback);
};

// delete a taxi
module.exports.deleteTaxi = function(id, callback){ //taxi = objekt iz forme
    var query = {_id: id};
    Taxi.remove(query, callback);
};
