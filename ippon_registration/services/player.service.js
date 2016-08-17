var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var ObjectID = require('mongoskin').ObjectID
var db = mongo.db(config.connectionString, {
    native_parser: true
});
db.bind('players');
db.bind('users');
db.bind('competition_players')
var service = {};
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.getSignedPlayers = getSignedPlayers;
service.getUnsignedPlayers = getUnsignedPlayers;
service.update = update;
service.delete = _delete;
service.addToCompetition = addToCompetition;
service.deleteFromCompetition = deleteFromCompetition;
module.exports = service;

function getAll(_userId) {
    var deferred = Q.defer();
    db.players.find({
        _userId: _userId
    }).toArray(function(err, player) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (player) {
            deferred.resolve(player);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getSignedPlayers(_userId, _competitionId) {
    var deferred = Q.defer();
    db.competition_players.find({
        _userId: _userId,
        _competitionId: _competitionId
    }).toArray(function(err, player) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (player) {
            deferred.resolve(player);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getUnsignedPlayers(_userId, _competitionId) {}

function getById(_id) {
    var deferred = Q.defer();
    db.players.findById(_id, function(err, player) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (player) {
            deferred.resolve(player);
        } else {
            // player not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(playerParam) {
    var deferred = Q.defer();
    createPlayer();

    function createPlayer() {
        var player = playerParam
        db.players.insert(player, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function update(_id, playerParam) {
    var deferred = Q.defer();
    db.players.findById(_id, function(err, player) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updatePlayer();
    });

    function updatePlayer() {
        // fields to update
        var set = {
            firstname: playerParam.firstname,
            lastname: playerParam.lastname,
            age: playerParam.age,
            weight: playerParam.weight,
            nationality: playerParam.nationality,
            sex: playerParam.sex
        };
        db.players.update({
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
    db.players.remove({
        _id: mongo.helper.toObjectID(_id)
    }, function(err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}

function addToCompetition(playerParam) {
    var deferred = Q.defer();   
    var competition_player = {
        _competitionId: playerParam._competitionId,
        _playerId: playerParam.player._id,       
        firstname: playerParam.player.firstname,
        lastname: playerParam.player.lastname,
        age: playerParam.player.age,
        weight: playerParam.player.weight,
        nationality: playerParam.player.nationality,
        sex: playerParam.player.sex,
        clubname: playerParam.player.clubname,
        _userId:  playerParam.player._userId,
        status: "for_verification"
    }  
    db.competition_players.insert(competition_player, function(err, doc) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}

function deleteFromCompetition(_id) {
    var deferred = Q.defer();  
    db.competition_players.remove({
        _playerId: _id
    }, function(err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}