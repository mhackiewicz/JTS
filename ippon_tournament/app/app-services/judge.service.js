(function () {
    'use strict';

    angular
        .module('app')
        .factory('JudgeService', Service);

    function Service($http, $q) {
        var service = {};
      
        service.GetAll = GetAll;
        service.GetById = GetById;      
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;    

        return service;
      

        function GetAll(compId) {            
            return $http.post('/api/judges/getAll', {competitionId: compId}).then(handleSuccess, handleError);
        }
       
        function GetById(_id) {         
            return $http.get('/api/judges/' + _id).then(handleSuccess, handleError);
        }
       

        function Create(judge) {
            return $http.post('/api/judges', judge).then(handleSuccess, handleError);
        }

        function Update(judge) {
            return $http.put('/api/judges/' + judge._id, judge).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/judges/' + _id).then(handleSuccess, handleError);
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
