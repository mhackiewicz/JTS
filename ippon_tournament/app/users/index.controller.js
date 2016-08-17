(function() {
    'use strict';
    angular.module('app').controller('Users.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;
        vm.user = null;
        vm.users = [];
        vm.addUser = addUser;       
        vm.openModal = openModal;
        vm.editUser = editUser;
        vm.deleteUser = deleteUser;
        initController();
        var $modal = angular.element('#myModal');

        function initController() {
            getAllUsers();
        }

        function editUser() {    

            UserService.Update(vm.user).then(function() {
                FlashService.Success('User updated');
                console.log('User updated');
                getAllUsers();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }      

        function addUser() {
           // console.log(vm.user);           
            UserService.Create(vm.user).then(function(reslut) {                
                FlashService.Success('User created');
                getAllUsers();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function deleteUser(id) {
            if (confirm("Are you sure?")) {
                UserService.Delete(id).then(function() {
                    getAllUsers();
                }).catch(function(error) {
                    FlashService.Error(error);
                });
            }
        }

        function getAllUsers() {
            UserService.GetAll().then(function(result) {
                vm.users = result;
            });
        }

        function openModal(id){
            if(id){
                UserService.GetById(id).then(function(result) {
                    vm.user = result;
                    vm.edit = true;
                    $modal.modal();
                });
            }else{
                vm.user = null;
                vm.edit = false;
                $modal.modal();
            }

        }
    }
})();