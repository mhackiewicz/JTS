(function () {
    'use strict';

    angular
        .module('app')
        .factory('PlayerService', Service);

    function Service($http, $q) {
        var service = {};
      
        service.GetAll = GetAll;
        service.GetById = GetById;      
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.AddToCompetition = AddToCompetition;
        service.DeleteFromCompetition = DeleteFromCompetition;
        service.GetSignedPlayers = GetSignedPlayers;

        return service;
      

        function GetAll(_userId) {
            console.log("Get ALL");
            return $http.get('/api/players/userplayers/'+_userId).then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/players/' + _id).then(handleSuccess, handleError);
        }
       

        function Create(player) {
            return $http.post('/api/players', player).then(handleSuccess, handleError);
        }

        function Update(player) {
            return $http.put('/api/players/' + player._id, player).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/players/' + _id).then(handleSuccess, handleError);
        }

        function DeleteFromCompetition(_id) {
            return $http.delete('/api/players/deleteFromCompetition/' + _id).then(handleSuccess, handleError);
        }

        function AddToCompetition(player, _competitionId){
            var data = {
                "_competitionId": _competitionId,
                "player": player
            };
            return $http.post('/api/players/addToCompetition' ,data).then(handleSuccess, handleError);
        }

        function GetSignedPlayers(_userId, _competitionId){
            return $http.get('/api/players/getSignedPlayers/' + _userId+'/'+_competitionId).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            console.log("ERROR");
            console.log(res);
            return $q.reject(res.data);
        }
    }

})();
