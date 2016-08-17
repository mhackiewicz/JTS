var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {
    native_parser: true
});
db.bind('competitions');
db.bind('competition_players')
var service = {};
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.update = update;
service.delete = _delete;
service.getAllPlayers = getAllPlayers;
module.exports = service;

function getAll() {
    var deferred = Q.defer();
    db.competitions.find().toArray(function(err, competition) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (competition) {
            deferred.resolve(competition);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    db.competitions.findById(_id, function(err, competition) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (competition) {
            deferred.resolve(competition);
        } else {
            // competition not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(competitionParam) {
    var deferred = Q.defer();
    createCompetition();

    function createCompetition() {
        var competition = competitionParam
        db.competitions.insert(competition, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function update(_id, competitionParam) {
    var deferred = Q.defer();
    db.competitions.findById(_id, function(err, competition) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateCompetition();
    });

    function updateCompetition() {
        // fields to update
        var set = {
            name: competitionParam.name,
            date: competitionParam.date,
            place: competitionParam.place,
            organizer: competitionParam.organizer,
            description: competitionParam.description,
            doc_src: competitionParam.doc_src,
            deadline_record: competitionParam.deadline_record
        };
        db.competitions.update({
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
    db.competitions.remove({
        _id: mongo.helper.toObjectID(_id)
    }, function(err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}

function getAllPlayers(_id) {
    var deferred = Q.defer();  
    db.competition_players.find({
        _competitionId: _id
    }).toArray(function(err, players) {
        if (err) deferred.reject(err.name + ': ' + err.message);        
        if (players) {
            deferred.resolve(players);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}