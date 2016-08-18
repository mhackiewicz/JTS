(function () {
    'use strict';

    angular
        .module('app')
        .factory('FightService', Service);

    function Service($http, $q) {
        var service = {};
      
        service.GetAll = GetAll;
        service.GetById = GetById;      
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;    
        service.GenerateFights = GenerateFights;    

        return service;
      

        function GetAll(compId) {          
            return $http.post('/api/fights/getAll', {competitionId: compId}).then(handleSuccess, handleError);
        }
       
        function GetById(_id) {          
            return $http.get('/api/fights/' + _id).then(handleSuccess, handleError);
        }

        function GenerateFights(compId){
             return $http.post('/api/fights/generateFights', {competitionId: compId}).then(handleSuccess, handleError);
        }
       

        function Create(fight) {
            return $http.post('/api/fights', fight).then(handleSuccess, handleError);
        }

        function Update(fight) {
            return $http.put('/api/fights/' + fight._id, fight).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/fights/' + _id).then(handleSuccess, handleError);
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
