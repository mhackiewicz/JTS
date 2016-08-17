var config = require('config.json');
var express = require('express');
var router = express.Router();
var judgeService = require('services/judge.service');

// routes
router.post('/getAll/', getAllJudges);
router.get('/:_id', getJudge);
router.post('/', createJudge);
router.put('/:_id', updateJudge);
router.delete('/:_id', deleteJudge);

module.exports = router;


function createJudge(req, res) {
    judgeService.create(req.body)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllJudges(req, res) {    
    judgeService.getAll(req.body.competitionId)
        .then(function (judge) {

            if (judge) {
                //console.log(judge); 
                res.send(judge);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getJudge(req, res) {   
    judgeService.getById(req.params._id)
        .then(function (judge) {
            if (judge) {               
                res.send(judge);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateJudge(req, res) {
    judgeService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteJudge(req, res) {
    judgeService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}