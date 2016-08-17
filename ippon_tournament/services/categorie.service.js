var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, {
    native_parser: true
});
db.bind('categories');
db.bind('competitions');
var service = {};
service.getById = getById;
service.create = create;
service.getAll = getAll;
service.update = update;
service.delete = _delete;
service.addDefault = addDefault;
module.exports = service;

function getAll(_id) {
    var deferred = Q.defer();
    db.categories.find({
        _competitionId: _id
    }).toArray(function(err, categorie) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (categorie) {
            deferred.resolve(categorie);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    db.categories.findById(_id, function(err, categorie) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (categorie) {
            deferred.resolve(categorie);
        } else {
            // categorie not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function create(categorieParam) {
    var deferred = Q.defer();
    createCategorie();

    function createCategorie() {
        var categorie = categorieParam
        db.categories.insert(categorie, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            var set = {
                categories: categorieParam
            };
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function update(_id, categorieParam) {
    var deferred = Q.defer();
    db.categories.findById(_id, function(err, categorie) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        updateCategorie();
    });

    function updateCategorie() {
        // fields to update
        var set = {
            name: categorieParam.name,
            sex: categorieParam.sex,
            created_at: categorieParam.created_at
        };
        db.categories.update({
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

function addDefault(param) {
    var deferred = Q.defer();
    console.log(param);
    var categorie1 = {
        _competitionId: param.competitionId,
        name: '-60 kg',
        sex: 'male'
    }
    var categorie2 = {
        _competitionId: param.competitionId,
        name: '-66 kg',
        sex: 'male'
    }
    var categorie3 = {
        _competitionId: param.competitionId,
        name: '-73 kg',
        sex: 'male'
    }
    var categorie4 = {
        _competitionId: param.competitionId,
        name: '-81 kg',
        sex: 'male'
    }
    var categorie5 = {
        _competitionId: param.competitionId,
        name: '-90 kg',
        sex: 'male'
    }
    var categorie6 = {
        _competitionId: param.competitionId,
        name: '-100 kg',
        sex: 'male'
    }
    var categorie7 = {
        _competitionId: param.competitionId,
        name: '+100 kg',
        sex: 'male'
    }
    var categorie8 = {
        _competitionId: param.competitionId,
        name: '-48 kg',
        sex: 'female'
    }
    var categorie9 = {
        _competitionId: param.competitionId,
        name: '-52 kg',
        sex: 'female'
    }
    var categorie10 = {
        _competitionId: param.competitionId,
        name: '-63 kg',
        sex: 'female'
    }
    var categorie11 = {
        _competitionId: param.competitionId,
        name: '-70 kg',
        sex: 'female'
    }
    var categorie12 = {
        _competitionId: param.competitionId,
        name: '-78 kg',
        sex: 'female'
    }
    var categorie13 = {
        _competitionId: param.competitionId,
        name: '+78 kg',
        sex: 'female'
    }
    createCategorie(categorie1);
    createCategorie(categorie2);
    createCategorie(categorie3);
    createCategorie(categorie4);
    createCategorie(categorie5);
    createCategorie(categorie6);
    createCategorie(categorie7);
    createCategorie(categorie8);
    createCategorie(categorie9);
    createCategorie(categorie10);
    createCategorie(categorie11);
    createCategorie(categorie12);
    createCategorie(categorie13);
    

    function createCategorie(categorie) {
       
        db.categories.insert(categorie, function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);          
            deferred.resolve();
        });
    }
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();
    db.categories.remove({
        _id: mongo.helper.toObjectID(_id)
    }, function(err) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve();
    });
    return deferred.promise;
}