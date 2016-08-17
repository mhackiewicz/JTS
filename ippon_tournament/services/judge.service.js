var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {
    native_parser: true
});
db.bind('judges');
db.bind('competitions');
var service = {};
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.update = update;
service.delete = _delete;
module.exports = service;

function getAll(_id) {
    var deferred = Q.defer();
   
    db.judges.find({
        _competitionId: _id       
    }).toArray(function(err, judge) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (judge) {
            deferred.resolve(judge);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();
    db.judges.findById(_id, function(err, judge) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (judge) {
            deferred.resolve(judge);
        } else {
            // judge not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(judgeParam) {
    var deferred = Q.defer();
    createJudge();

    function createJudge() {
        var judge = judgeParam
        db.judges.insert(judge, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            var set = {
                judges: judgeParam
            };
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function update(_id, judgeParam) {
    var deferred = Q.defer();
    db.judges.findById(_id, function(err, judge) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateJudge();
    });

    function updateJudge() {
        // fields to update
        var set = {
            firstname: judgeParam.firstname,
            lastname: judgeParam.lastname,
            created_at: judgeParam.created_at
        };
        db.judges.update({
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
    db.judges.remove({
        _id: mongo.helper.toObjectID(_id)
    }, function(err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}