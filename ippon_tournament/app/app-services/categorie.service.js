(function () {
    'use strict';

    angular
        .module('app')
        .factory('CategorieService', Service);

    function Service($http, $q) {
        var service = {};
      
        service.GetAll = GetAll;
        service.GetById = GetById;      
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;  
        service.AddDefault = AddDefault;  

        return service;
      

        function GetAll(compId) {            
            return $http.post('/api/categories/getAll', {competitionId: compId}).then(handleSuccess, handleError);
        }

        function AddDefault(compId) {           
            return $http.post('/api/categories/addDefault', {competitionId: compId}).then(handleSuccess, handleError);
        }
       
        function GetById(_id) {           
            return $http.get('/api/categories/' + _id).then(handleSuccess, handleError);
        }
       

        function Create(categorie) {
            return $http.post('/api/categories', categorie).then(handleSuccess, handleError);
        }

        function Update(categorie) {
            return $http.put('/api/categories/' + categorie._id, categorie).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/categories/' + _id).then(handleSuccess, handleError);
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
