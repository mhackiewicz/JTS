var config = require('config.json');
var express = require('express');
var router = express.Router();
var competitionService = require('services/competition.service');
// routes
router.get('/', getAllCompetitions);
router.get('/:_id', getCompetition);
router.post('/', createCompetition);
router.put('/:_id', updateCompetition);
router.get('/getAllPlayers/:_id',getAllPlayers);
router.delete('/:_id', deleteCompetition);
module.exports = router;

function createCompetition(req, res) {
    competitionService.create(req.body).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getAllCompetitions(req, res) {
    competitionService.getAll().then(function(competition) {
        if (competition) {
            //console.log(competition); 
            res.send(competition);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getCompetition(req, res) {
    competitionService.getById(req.params._id).then(function(competition) {
        if (competition) {
            res.send(competition);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function updateCompetition(req, res) { 
    competitionService.update(req.params._id, req.body).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function deleteCompetition(req, res) { 
    competitionService.delete(req.params._id).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getAllPlayers(req, res){
     competitionService.getAllPlayers(req.params._id).then(function(players) {
        if (players) {        
            res.send(players);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}