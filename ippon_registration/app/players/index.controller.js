(function () {
    'use strict';

    angular
        .module('app')
        .controller('Players.IndexController', Controller);
   
     function Controller($window, UserService, PlayerService, FlashService) {
        var vm = this;
        vm.player = null;
        vm.players = [];
        vm.addPlayer = addPlayer;       
        vm.openModal = openModal;
        vm.editPlayer = editPlayer;
        vm.deletePlayer = deletePlayer;      
        vm.user = null
        vm.isAdmin = false;
        initController();
        var $modal = angular.element('#myModal');

        function initController() {
            angular.element('.datepicker').datepicker({
                format: 'mm/dd/yyyy'
            });
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                if(user.role=='admin'){
                    vm.isAdmin = true;
                }        
                getAllPlayers();       
            });

           
        }

        function editPlayer() {    
            vm.player.created_at = new Date();        
            PlayerService.Update(vm.player).then(function() {
                FlashService.Success('Player updated');
                getAllPlayers();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }      

        function addPlayer() {
           // console.log(vm.user);
            vm.player.created_at = new Date();
            vm.player._userId = vm.user._id;
            vm.player.clubname = vm.user.clubname;
            PlayerService.Create(vm.player).then(function(reslut) {
                console.log(reslut);
                // vm.players.push(vm.player)
                FlashService.Success('Player created');
                getAllPlayers();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function deletePlayer(id) {
            if (confirm("Are you sure?")) {
                PlayerService.Delete(id).then(function() {
                    getAllPlayers();
                }).catch(function(error) {
                    FlashService.Error(error);
                });
            }
        }

        function getAllPlayers() {
            PlayerService.GetAll(vm.user._id).then(function(result) {
                vm.players = result;
            });
        }

        function openModal(id){
            if(id){
                PlayerService.GetById(id).then(function(result) {
                    vm.player = result;
                    vm.edit = true;
                    $modal.modal();
                });
            }else{
                vm.player = {};
                vm.player.sex = "male";
                vm.player.nationality = "POL";
                vm.edit = false;
                $modal.modal();
            }
        }
     
    }

})();