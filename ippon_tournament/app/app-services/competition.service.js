(function () {
    'use strict';

    angular
        .module('app')
        .factory('CompetitionService', Service);

    function Service($http, $q) {
        var service = {};
      
        service.GetAll = GetAll;
        service.GetById = GetById;      
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetAllPlayers = GetAllPlayers;

        return service;
      

        function GetAll() {        
            return $http.get('/api/competitions').then(handleSuccess, handleError);
        }

        function GetAllPlayers(_id) {          
            return $http.get('/api/competitions/getAllPlayers/'+_id).then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/competitions/' + _id).then(handleSuccess, handleError);
        }
       

        function Create(competition) {
            return $http.post('/api/competitions', competition).then(handleSuccess, handleError);
        }

        function Update(competition) {
            return $http.put('/api/competitions/' + competition._id, competition).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/competitions/' + _id).then(handleSuccess, handleError);
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
