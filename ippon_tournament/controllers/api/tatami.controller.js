var config = require('config.json');
var express = require('express');
var router = express.Router();
var tatamiService = require('services/tatami.service');

// routes
router.get('/:_id', getAllTatamis);
router.get('/:_id', getTatami);
router.get('/getJudges/:_id', getJudgeByTatamiId);
router.post('/', createTatami);
router.post('/addJudges',addJudgesToTatami);
router.post('/addCategories',addCategoriesToTatami);
router.put('/:_id', updateTatami);
router.delete('/:_id', deleteTatami);

module.exports = router;


function createTatami(req, res) {
    tatamiService.create(req.body)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTatamis(req, res) {    
    tatamiService.getAll(req.params._id)
        .then(function (tatami) {

            if (tatami) {
                //console.log(tatami); 
                res.send(tatami);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getTatami(req, res) {
    tatamiService.getById(req.params._id)
        .then(function (tatami) {
            if (tatami) {
                res.send(tatami);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTatami(req, res) {
    tatamiService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTatami(req, res) {
    tatamiService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addJudgesToTatami(req, res) {
    tatamiService.addJudges(req.body.judge, req.body._tatamiId)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addCategoriesToTatami(req, res) {
    tatamiService.addCategories(req.body.categorie, req.body._tatamiId)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getJudgeByTatamiId(req, res) {   
    tatamiService.getJudgeByTatamiId(req.params._id)
        .then(function (tatami) {
            if (tatami) {

                res.send(tatami);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}