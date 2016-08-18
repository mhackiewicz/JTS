var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {
    native_parser: true
});
db.bind('tatamis');
db.bind('competitions');
db.bind('tatami_judges');
var service = {};
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.update = update;
service.delete = _delete;
service.addJudges = addJudges;
service.addCategories = addCategories;
service.addStaff = addStaff;
module.exports = service;

function getAll(_id) {
    var deferred = Q.defer();
    db.tatamis.find({
        _competitionId: _id
    }).toArray(function(err, tatami) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (tatami) {
            deferred.resolve(tatami);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    db.tatamis.findById(_id, function(err, tatami) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (tatami) {
            deferred.resolve(tatami);
        } else {
            // tatami not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(tatamiParam) {
    var deferred = Q.defer();
    createTatami();

    function createTatami() {
        var tatami = tatamiParam
        db.tatamis.insert(tatami, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function addJudges(_id, judge) {
    var deferred = Q.defer();
    db.tatamis.findById(_id, function(err, tatami) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateTatami();
    });

    function updateTatami() {       
        var set = {
            judges: judge
        };
        db.tatamis.update({
            _id: mongo.helper.toObjectID(_id)
        }, {
            $set: set
        }, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function addCategories(_id, categorie) {
    var deferred = Q.defer();
    db.tatamis.findById(_id, function(err, tatami) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateTatami();
    });
    console.log(categorie)
    function updateTatami() {       
        var set = {
            categories: categorie
        };
        db.tatamis.update({
            _id: mongo.helper.toObjectID(_id)
        }, {
            $set: set
        }, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function addStaff(_id, staff) {
    var deferred = Q.defer();
    db.tatamis.findById(_id, function(err, tatami) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateTatami();
    });

    function updateTatami() {     
        var set = {
            staff: staff
        };
        db.tatamis.update({
            _id: mongo.helper.toObjectID(_id)
        }, {
            $set: set
        }, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function update(_id, tatamiParam) {
    var deferred = Q.defer();
    db.tatamis.findById(_id, function(err, tatami) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateTatami();
    });

    function updateTatami() {
        // fields to update
        var set = {
            created_at: tatamiParam.created_at
        };
        db.tatamis.update({
            _id: mongo.helper.toObjectID(_id)
        }, {
            $set: set
        }, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    db.tatamis.remove({
        _id: mongo.helper.toObjectID(_id)
    }, function(err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}

