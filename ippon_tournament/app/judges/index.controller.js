(function() {
    'use strict';
    angular.module('app').controller('Judges.IndexController', Controller);

    function Controller($rootScope, $window, JudgeService, FlashService) {
        var vm = this;
        vm.judge = {};
        vm.judges = [];
        vm.addJudge = addJudge;
        vm.openModal = openModal;
        vm.editJudge = editJudge;
        vm.deleteJudge = deleteJudge;       
        initController();
        var $modal = angular.element('#myModal');

        function initController() {           
            getAllJudges();
        }

        function editJudge() {
            vm.judge.created_at = new Date();
            JudgeService.Update(vm.judge).then(function() {
                FlashService.Success('Judge updated');
                getAllJudges();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function addJudge() {
            // console.log(vm.user); 
            vm.judge._competitionId = localStorage.actualCompetition;                           
            vm.judge.created_at = new Date();           
            JudgeService.Create(vm.judge).then(function(reslut) {               
                FlashService.Success('Judge created');
                getAllJudges();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function deleteJudge(id) {
            if (confirm("Are you sure?")) {
                JudgeService.Delete(id).then(function() {
                    getAllJudges();
                }).catch(function(error) {
                    FlashService.Error(error);
                });
            }
        }

        function getAllJudges() {
            JudgeService.GetAll(localStorage.actualCompetition).then(function(result) {
                vm.judges = result;
            });
        }

        function openModal(id) {
            if (id) {
                JudgeService.GetById(id).then(function(result) {
                    console.log(id);
                    console.log(result);
                    vm.judge = result;
                    vm.edit = true;
                    $modal.modal();
                });
            } else {
                vm.judge = null;
                vm.edit = false;
                $modal.modal();
            }
        }
    }
})();