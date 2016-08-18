(function () {
    'use strict';

    angular
        .module('app')
        .factory('TatamiService', Service);

    function Service($http, $q) {
        var service = {};
      
        service.GetAll = GetAll;
        service.GetById = GetById;      
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.AddJudges = AddJudges;     
        service.AddCategories = AddCategories;   
        service.AddStaff = AddStaff;  

        return service;
      

        function GetAll(compId) {
            console.log("Get ALL");
            return $http.get('/api/tatamis/'+ compId).then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/tatamis/' + _id).then(handleSuccess, handleError);
        }
       

        function Create(tatami) {
            return $http.post('/api/tatamis', tatami).then(handleSuccess, handleError);
        }

        function AddJudges(tatamiId, judge) {
            return $http.post('/api/tatamis/addJudges', {
                judge: judge,
                _tatamiId: tatamiId
            }).then(handleSuccess, handleError);
        }    

         function AddCategories(tatamiId, categorie) {
            return $http.post('/api/tatamis/addCategories', {
                categorie: categorie,
                _tatamiId: tatamiId
            }).then(handleSuccess, handleError);
        }   

        function AddStaff(tatamiId, staff) {
            return $http.post('/api/tatamis/addStaff', {
                staff: staff,
                _tatamiId: tatamiId
            }).then(handleSuccess, handleError);
        }    


        function Update(tatami) {
            return $http.put('/api/tatamis/' + tatami._id, tatami).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/tatamis/' + _id).then(handleSuccess, handleError);
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
