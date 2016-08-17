var config = require('config.json');
var express = require('express');
var router = express.Router();
var categorieService = require('services/categorie.service');

// routes
router.post('/getAll/', getAllCategories);
router.post('/addDefault/', addDefault);
router.get('/:_id', getCategorie);
router.post('/', createCategorie);
router.put('/:_id', updateCategorie);
router.delete('/:_id', deleteCategorie);

module.exports = router;


function createCategorie(req, res) {
    categorieService.create(req.body)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addDefault(req, res) {
    categorieService.addDefault(req.body)
        .then(function () {           
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllCategories(req, res) {    
    categorieService.getAll(req.body.competitionId)
        .then(function (categorie) {

            if (categorie) {
                //console.log(categorie); 
                res.send(categorie);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getCategorie(req, res) {   
    categorieService.getById(req.params._id)
        .then(function (categorie) {
            if (categorie) {               
                res.send(categorie);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateCategorie(req, res) {
    categorieService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteCategorie(req, res) {
    categorieService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}