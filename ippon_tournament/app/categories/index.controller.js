(function() {
    'use strict';
    angular.module('app').controller('Categories.IndexController', Controller);

    function Controller($rootScope, $window, CategorieService, FlashService) {
        var vm = this;
        vm.categorie = {};
        vm.categories = [];
        vm.addCategorie = addCategorie;
        vm.openModal = openModal;
        vm.editCategorie = editCategorie;
        vm.deleteCategorie = deleteCategorie;
        vm.addDefault = addDefault;
        initController();
        var $modal = angular.element('#myModal');

        function initController() {
            getAllCategories();
        }

        function editCategorie() {
            vm.categorie.created_at = new Date();
            CategorieService.Update(vm.categorie).then(function() {
                FlashService.Success('Categorie updated');
                getAllCategories();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function addCategorie() {
            // console.log(vm.user); 
            vm.categorie._competitionId = localStorage.actualCompetition;
            vm.categorie.created_at = new Date();
            CategorieService.Create(vm.categorie).then(function(reslut) {
                FlashService.Success('Categorie created');
                getAllCategories();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function deleteCategorie(id) {
            if (confirm("Are you sure?")) {
                CategorieService.Delete(id).then(function() {
                    getAllCategories();
                }).catch(function(error) {
                    FlashService.Error(error);
                });
            }
        }

        function getAllCategories() {
            CategorieService.GetAll(localStorage.actualCompetition).then(function(result) {
                vm.categories = result;
            });
        }

        function openModal(id) {
            if (id) {
                CategorieService.GetById(id).then(function(result) {
                    console.log(id);
                    console.log(result);
                    vm.categorie = result;
                    vm.edit = true;
                    $modal.modal();
                });
            } else {
                vm.categorie = {};
                vm.categorie.sex = "male";
                vm.edit = false;
                $modal.modal();
            }
        }

        function addDefault() {
            CategorieService.AddDefault(localStorage.actualCompetition).then(function(result) {
                getAllCategories();
            });
        }
    }
})();