(function() {
    'use strict';
    angular.module('app').controller('Dashboard.IndexController', Controller);

    function Controller($window, UserService, CompetitionService, PlayerService, FlashService) {
        var vm = this;
        vm.competition = null;
        vm.competitions = [];
        vm.user = null
        vm.isAdmin = false;
        initController();
        vm.players = [];
        vm.signedPlayers = [];
        vm.allCompetitors = [];
        vm.addCompetition = addCompetition;
        vm.openModal = openModal;
        vm.editCompetition = editCompetition;
        vm.deleteCompetition = deleteCompetition;
        vm.openSignUpModal = openSignUpModal;
        vm.signPlayer = signPlayer;
        vm.cancelPlayer = cancelPlayer;
        vm.addPlayersToCompetition = addPlayersToCompetition;
        vm.openCompetitorsModal = openCompetitorsModal;        
        var $modal = angular.element('#myModal');
        var $signUpModal = angular.element('#signUpModal');
        var $competitorsModal = angular.element('#competitorsModal');
        var competitionId = null;
        var canceledPlayers = [], additionalPlayers = [];

        function initController() {
            angular.element('.datepicker').datepicker({
                format: 'mm/dd/yyyy'
            });
            UserService.GetCurrent().then(function(user) {
                vm.user = user;
                if (user.role == 'admin') {
                    vm.isAdmin = true;
                }                
            });
            getAllCompetitions();
        }

        function editCompetition() {
            vm.competition.created_at = new Date();
            CompetitionService.Update(vm.competition).then(function() {
                FlashService.Success('Competition updated');
                getAllCompetitions();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function addCompetition() {
            vm.competition.created_at = new Date();
            vm.competition.status = "new";
            CompetitionService.Create(vm.competition).then(function(reslut) {
                FlashService.Success('Competition created');
                getAllCompetitions();
                $modal.modal("hide")
            }).catch(function(error) {
                FlashService.Error(error);
            });
        }

        function deleteCompetition(id) {
            if (confirm("Are you sure?")) {
                CompetitionService.Delete(id).then(function() {
                    getAllCompetitions();
                }).catch(function(error) {
                    FlashService.Error(error);
                });
            }
        }

        function getAllCompetitions() {
            CompetitionService.GetAll().then(function(result) {
                vm.competitions = result;
            });
        }

        function openModal(id) {
            if (id) {
                CompetitionService.GetById(id).then(function(result) {
                    vm.competition = result;
                    vm.edit = true;
                    $modal.modal();
                });
            } else {
                vm.competition = null;
                vm.edit = false;
                $modal.modal();
            }
        }

        function openSignUpModal(id) {
            additionalPlayers = [], canceledPlayers =[];
            vm.signedPlayers = [];
            PlayerService.GetAll(vm.user._id).then(function(result) {               
                vm.players = result;
                competitionId = id;
            });
            PlayerService.GetSignedPlayers(vm.user._id, id).then(function(result) {
                // angular.forEach(result, function(value, key) {
                //     vm.signedPlayers.push(value.players);
                // });
                vm.signedPlayers = result;
                angular.forEach(vm.signedPlayers, function(value, key) {
                    angular.forEach(vm.players, function(value2, key2) {                       
                        if (value._playerId == value2._id) {                            
                            vm.players.splice(key2, 1);
                        }
                    });
                });
                $signUpModal.modal();
            });         
        }

        function signPlayer(player, index) {
            vm.signedPlayers.push(player);
            additionalPlayers.push(player);
            vm.players.splice(index, 1);
        }

        function cancelPlayer(player, index) {
            vm.players.push(player);
            canceledPlayers.push(player);

            vm.signedPlayers.splice(index, 1);
        }

        function addPlayersToCompetition() {
            angular.forEach(additionalPlayers, function(value, key) {
                PlayerService.AddToCompetition(value, competitionId).then(function(reslut) {}).catch(function(error) {
                    FlashService.Error(error);
                });
            });           
            angular.forEach(canceledPlayers, function(value, key) {
                PlayerService.DeleteFromCompetition(value._playerId).then(function(reslut) {}).catch(function(error) {
                    FlashService.Error(error);
                });
            });        
            $signUpModal.modal("hide");
        }

        function openCompetitorsModal(id){           
            CompetitionService.GetAllPlayers(id).then(function(result) {
                console.log("openCompetitorsModal", result)
                vm.allCompetitors = result;
                $competitorsModal.modal();
            });
        }       
    }
})();