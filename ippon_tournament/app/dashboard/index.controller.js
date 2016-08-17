(function() {
    'use strict';
    angular.module('app').controller('Dashboard.IndexController', Controller);

    function Controller($scope, $window, TatamiService, JudgeService, CategorieService, FlashService) {
        var vm = this;
        vm.tatami = {};
        vm.tatamis = [];
        vm.addTatami = addTatami;
        vm.openModal = openModal;
        vm.editTatami = editTatami;
        vm.deleteTatami = deleteTatami;
        vm.addJudges = addJudges;
        vm.addFights = addFights;
        vm.addStuff = addStuff;
        vm.saveJudgesOnTatami = saveJudgesOnTatami;
        vm.saveCategoriesOnTatami = saveCategoriesOnTatami;
        vm.actualTatami = null;
        vm.addingJudges = [];
        vm.judges = [];
        vm.categories =[];
        vm.addingCategories= [];
        initController();
        var $judgesModal = angular.element('#addJudgesModal');
        var $stuffModal = angular.element('#addStuffModal');
        var $fightsModal = angular.element('#addFightsModal');       

        function initController() {
            getAllTatamis();            
            angular.element('#judgesSelect').select2({
                maximumSelectionLength: 3
            });

             angular.element('#categoriesSelect').select2();

        }

        function editTatami() {
            vm.tatami.created_at = new Date();
            TatamiService.Update(vm.tatami).then(function() {
                FlashService.Success('Tatami updated');
                getAllTatamis();
                //                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function addTatami() {
            // console.log(vm.user);
            var tatami = {};
            tatami.name = "tatami " + (vm.tatamis.length + 1)
            tatami.created_at = new Date();
            tatami._competitionId = localStorage.actualCompetition;
            TatamiService.Create(tatami).then(function(reslut) {
                FlashService.Success('Tatami created');
                getAllTatamis();
                //$modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function deleteTatami(id) {
            if (confirm("Are you sure?")) {
                TatamiService.Delete(id).then(function() {
                    getAllTatamis();
                }).catch(function(error) {
                    FlashService.Error(error);
                });
            }
        }

        function getAllTatamis() {
            vm.judges = [];
            TatamiService.GetAll(localStorage.actualCompetition).then(function(result) {
                vm.tatamis = result;
            });
        }

        function getAllJudges() {                   
            JudgeService.GetAll(localStorage.actualCompetition).then(function(result) {
                vm.judges = result;                
            });
        }

         function getAllCategories() {                   
            CategorieService.GetAll(localStorage.actualCompetition).then(function(result) {
                vm.categories = result;                
            });
        }

        function openModal(id) {
            if (id) {
                TatamiService.GetById(id).then(function(result) {
                    vm.tatami = result;
                    vm.edit = true;
                    $modal.modal();
                });
            } else {
                vm.tatami = null;
                vm.edit = false;
                $modal.modal();
            }
        }

        function addJudges(id) {        
            vm.actualTatami = id;
           getAllJudges();
            $judgesModal.modal();
        }

        function addFights(id) {
             vm.actualTatami = id;
           getAllCategories();           
            $fightsModal.modal();
        }

        function addStuff(id) {
            $stuffModal.modal();
        }

        function saveJudgesOnTatami() {           
            TatamiService.AddJudges(vm.addingJudges, vm.actualTatami).then(function(reslut) {}).catch(function(error) {
                FlashService.Error(error);
            });
            getAllTatamis();
            $judgesModal.modal("hide");
        }

        function saveCategoriesOnTatami() {           
            TatamiService.AddCategories(vm.addingCategories, vm.actualTatami).then(function(reslut) {}).catch(function(error) {
                FlashService.Error(error);
            });
            getAllTatamis();
            $fightsModal.modal("hide");
        }
        
    }
})();