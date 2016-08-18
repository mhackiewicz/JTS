var config = require('config.json');
var express = require('express');
var router = express.Router();
var playerService = require('services/player.service');
// routes
router.post('/getAll/', getAllPlayers);
router.post('/getAllForVerify/', getAllPlayersForVerify);
router.post('/getAllForWeighting/', getAllPlayersForWeighting);
router.get('/:_id', getPlayer);
router.post('/', createPlayer);
router.put('/:_id', updatePlayer);
router.delete('/:_id', deletePlayer);
router.delete('/deleteFromCompetition/:_playerId', deleteFromCompetition);
router.post('/addToCompetition/', addPlayerToCompetition);
router.get('/getSignedPlayers/:_userId/:_competitionId', getSignedPlayers);
module.exports = router;

function createPlayer(req, res) {
    playerService.create(req.body).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getAllPlayers(req, res) {
    playerService.getAll(req.body.competitionId).then(function(player) {
        if (player) {        
            res.send(player);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getAllPlayersForWeighting(req, res) {
    playerService.getAllForWeighting(req.body.competitionId).then(function(player) {
        if (player) {        
            res.send(player);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getAllPlayersForVerify(req, res) {
    playerService.getAllForVerify(req.body.competitionId).then(function(player) {
        if (player) {        
            res.send(player);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getPlayer(req, res) {   
    playerService.getById(req.params._id).then(function(player) {
        if (player) {
            console.log(player);
            res.send(player);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function updatePlayer(req, res) {    
    playerService.update(req.params._id, req.body).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function deletePlayer(req, res) {
    playerService.delete(req.params._id).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function addPlayerToCompetition(req, res) {
    playerService.addToCompetition(req.body).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function deleteFromCompetition(req, res) {   
    playerService.deleteFromCompetition(req.params._playerId).then(function() {
        res.sendStatus(200);
    }).catch(function(err) {
        res.status(400).send(err);
    });
}

function getSignedPlayers(req, res) {
    playerService.getSignedPlayers(req.params._userId, req.params._competitionId).then(function(players) {
        if (players) {
            res.send(players);
        } else {
            res.sendStatus(404);
        }
    }).catch(function(err) {
        res.status(400).send(err);
    });
}