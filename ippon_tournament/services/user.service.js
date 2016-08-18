﻿var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('staff');

db.staff.findOne({ role: 'admin' }, function (err, user) {   
    if (user == null){
        db.staff.insert({
            email:"admin", 
            role:"admin",
            hash: bcrypt.hashSync("admin", 10),
            firstname: "admin",
            lastname:"admin",
            clubname: "admin"
        });
    }
});

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.getAllForTatamis = getAllForTatamis;

service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(_id) {
    var deferred = Q.defer();   
    db.staff.find({
        _competitionId: _id
    }).toArray(function(err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {    

            deferred.resolve(user);
        } else {           
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAllForTatamis(_id) {
    var deferred = Q.defer();   
    db.staff.find({
        _competitionId: _id,
        role: 'fight_service'
    }).toArray(function(err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {    

            deferred.resolve(user);
        } else {           
            deferred.resolve();
        }
    });

    return deferred.promise;
}




function authenticate(username, password) {
    var deferred = Q.defer();

    db.staff.findOne({ email: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.staff.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {           
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.staff.findOne(
        { email: userParam.email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Email "' + userParam.email + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {       
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.staff.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.staff.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.staff.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstname: userParam.firstname,
            lastname: userParam.lastname,
            username: userParam.email,
            clubname: userParam.clubname,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.staff.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {    
    var deferred = Q.defer();

    db.staff.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}