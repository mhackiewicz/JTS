var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {
    native_parser: true
});
db.bind('fights');
db.bind('competitions');
db.bind('competition_players');
db.bind('categories');
db.bind('tatamis');
var service = {};
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.update = update;
service.delete = _delete;
service.generateFights = generateFights;
module.exports = service;

function getAll(_id) {
    var deferred = Q.defer();
    db.fights.find({
        _competitionId: _id
    }).toArray(function(err, fight) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (fight) {
            deferred.resolve(fight);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    db.fights.findById(_id, function(err, fight) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (fight) {
            deferred.resolve(fight);
        } else {
            // fight not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(fightParam) {
    var deferred = Q.defer();
    createFight();

    function createFight() {
        var fight = fightParam
        db.fights.insert(fight, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            var set = {
                fights: fightParam
            };
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function generateFights(params) {
    console.log("generateFights");
    var deferred = Q.defer();
    db.categories.find({
        _competitionId: params.competitionId
    }).toArray(function(err, categories) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (categories) {
            categories.forEach(function(cat) {
                    // for (var i = 0; i < categories.length; i++) {
                    db.competition_players.find({
                        _competitionId: params.competitionId,
                        weight: cat.name,
                        status: 'ready'
                    }).toArray(function(err, players) {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        if (players) {
                            var len = players.length;
                            if (len > 0) {
                                db.tatamis.findOne({
                                    _competitionId: params.competitionId,
                                    "categories.name": cat.name
                                }, function(err, tatami) {
                                    if (err) deferred.reject(err.name + ': ' + err.message);
                                    if (tatami) {
                                        // console.log(cat.name);
                                        // console.log('!!!!!!!!!!!!!!!!!!!');
                                        // console.log(tatami.name);
                                        // players.forEach(function(player) {
                                        //     //for (var p = 0; p < players.length; p++) {
                                        //     console.log(player.lastname + " " + player.firstname);
                                        // });
                                        if (len == 1) {
                                            console.log("Za mało zawodników");
                                            // createFight(players[0], {},tatami.name);
                                        } else if (len >= 2 && len <= 5) {
                                            console.log("Genereuj w systemie 'kazdy z kazdym'");
                                            if (len == 2) {
                                                createFight(players[0], players[1]);
                                            } else if (len == 3) {
                                                createFight(players[0], players[1], tatami.name, 1);
                                                createFight(players[0], players[2], tatami.name, 1);
                                                createFight(players[1], players[2], tatami.name, 1);
                                            } else if (len == 4) {
                                                createFight(players[0], players[1], tatami.name, 1);
                                                createFight(players[0], players[2], tatami.name, 1);
                                                createFight(players[0], players[3], tatami.name, 1);
                                                createFight(players[1], players[2], tatami.name, 1);
                                                createFight(players[1], players[3], tatami.name, 1);
                                                createFight(players[2], players[3], tatami.name, 1);
                                            } else if (len == 5) {
                                                createFight(players[0], players[1], tatami.name, 1);
                                                createFight(players[0], players[2], tatami.name, 1);
                                                createFight(players[0], players[3], tatami.name, 1);
                                                createFight(players[0], players[4], tatami.name, 1);
                                                createFight(players[1], players[2], tatami.name, 1);
                                                createFight(players[1], players[3], tatami.name, 1);
                                                createFight(players[1], players[4], tatami.name, 1);
                                                createFight(players[2], players[3], tatami.name, 1);
                                                createFight(players[2], players[4], tatami.name, 1);
                                                createFight(players[3], players[4], tatami.name, 1);
                                            }
                                        } else if (len >= 6 && len <= 8) {
                                            console.log("Genereuj w systemie brukselskim");
                                            if (len == 6) {
                                                createFight(players[0], players[1], tatami.name, 2);
                                                createFight(players[0], players[2], tatami.name, 2);
                                                createFight(players[1], players[2], tatami.name, 2);
                                                createFight(players[3], players[4], tatami.name, 2);
                                                createFight(players[3], players[5], tatami.name, 2);
                                                createFight(players[4], players[5], tatami.name, 2);
                                            } else if (len == 7) {
                                                createFight(players[0], players[1], tatami.name, 2);
                                                createFight(players[0], players[2], tatami.name, 2);
                                                createFight(players[0], players[3], tatami.name, 2);
                                                createFight(players[1], players[2], tatami.name, 2);
                                                createFight(players[1], players[3], tatami.name, 2);
                                                createFight(players[2], players[3], tatami.name, 2);
                                                createFight(players[4], players[5], tatami.name, 2);
                                                createFight(players[4], players[7], tatami.name, 2);
                                                createFight(players[5], players[7], tatami.name, 2);
                                            } else if (len == 8) {
                                                createFight(players[0], players[1], tatami.name, 2);
                                                createFight(players[0], players[2], tatami.name, 2);
                                                createFight(players[0], players[3], tatami.name, 2);
                                                createFight(players[1], players[2], tatami.name, 2);
                                                createFight(players[1], players[3], tatami.name, 2);
                                                createFight(players[2], players[3], tatami.name, 2);
                                                createFight(players[4], players[5], tatami.name, 2);
                                                createFight(players[4], players[6], tatami.name, 2);
                                                createFight(players[4], players[7], tatami.name, 2);
                                                createFight(players[5], players[6], tatami.name, 2);
                                                createFight(players[5], players[7], tatami.name, 2);
                                                createFight(players[6], players[7], tatami.name, 2);
                                            }
                                        } else if (len >= 9) {
                                            console.log("Genereuj w systemie francuskim");
                                            players.forEach(function(player, index) {
                                                if (index % 2 == 0) {
                                                    if (players[index + 1] !== undefined) {
                                                        createFight(players[index], players[index + 1], tatami.name, 3);
                                                    }
                                                }
                                            });
                                        }
                                    } else {
                                        deferred.resolve();
                                    }
                                });
                            }
                        } else {}
                    });
                })
                //deferred.resolve();
        } else {
            deferred.resolve();
        }
    });
    //createFight();
    function createFight(player1, player2, tatami, comp_type) {
        console.log("create fight");
        var fight = {
            _competitionId: params.competitionId,
            player1: player1,
            player2: player2,
            result: "0 0 0 0: 0 0 0 0",
            status: 'new',
            time: "00:00",
            tatami: tatami,
            comp_type: comp_type
        };
        db.fights.insert(fight, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
        deferred.resolve();
    }
    return deferred.promise;
}

function update(_id, fightParam) {
    var deferred = Q.defer();
    db.fights.findById(_id, function(err, fight) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateFight();
    });

    function updateFight() {
        // fields to update
        var set = {
            // firstname: fightParam.firstname,
            // lastname: fightParam.lastname,
            // created_at: fightParam.created_at
        };
        db.fights.update({
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
    db.fights.remove({
        _id: mongo.helper.toObjectID(_id)
    }, function(err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}