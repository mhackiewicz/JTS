(function() {
    'use strict';
    angular.module('app').controller('Fights.IndexController', Controller);

    function Controller($rootScope, $window, FightService, FlashService) {
        var vm = this;
        vm.fight = {};
        vm.fights = [];
        vm.addFight = addFight;
        vm.openModal = openModal;
        vm.editFight = editFight;
        vm.deleteFight = deleteFight; 
        vm.generateFights = generateFights;      
        initController();
        var $modal = angular.element('#myModal');

        function initController() {           
            getAllFights();
        }

        function editFight() {
            vm.fight.created_at = new Date();
            FightService.Update(vm.fight).then(function() {
                FlashService.Success('Fight updated');
                getAllFights();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function addFight() {
            // console.log(vm.user); 
            vm.fight._competitionId = localStorage.actualCompetition;                           
            vm.fight.created_at = new Date();           
            FightService.Create(vm.fight).then(function(reslut) {               
                FlashService.Success('Fight created');
                getAllFights();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function deleteFight(id) {
            if (confirm("Are you sure?")) {
                FightService.Delete(id).then(function() {
                    getAllFights();
                }).catch(function(error) {
                    FlashService.Error(error);
                });
            }
        }

        function getAllFights() {
            FightService.GetAll(localStorage.actualCompetition).then(function(result) {
                vm.fights = result;
            });
        }

        function openModal(id) {
            if (id) {
                FightService.GetById(id).then(function(result) {
                    console.log(id);
                    console.log(result);
                    vm.fight = result;
                    vm.edit = true;
                    $modal.modal();
                });
            } else {
                vm.fight = null;
                vm.edit = false;
                $modal.modal();
            }
        }

        function generateFights(){
            FightService.GenerateFights(localStorage.actualCompetition).then(function(result) {
               console.log(result)
               getAllFights();
            });
        }
    }
})();