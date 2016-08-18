var config = require('config.json');
var express = require('express');
var router = express.Router();
var fightService = require('services/fight.service');

// routes
router.post('/getAll/', getAllFights);
router.post('/generateFights/', generateFights);
router.get('/:_id', getFight);
router.post('/', createFight);
router.put('/:_id', updateFight);
router.delete('/:_id', deleteFight);

module.exports = router;


function createFight(req, res) {
    fightService.create(req.body)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function generateFights(req, res) {
    fightService.generateFights(req.body)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllFights(req, res) {    
    fightService.getAll(req.body.competitionId)
        .then(function (fight) {

            if (fight) {
                //console.log(fight); 
                res.send(fight);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getFight(req, res) {   
    fightService.getById(req.params._id)
        .then(function (fight) {
            if (fight) {               
                res.send(fight);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateFight(req, res) {
    fightService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteFight(req, res) {
    fightService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}