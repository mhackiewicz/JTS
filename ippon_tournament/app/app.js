﻿(function() {
    'use strict';
    angular.module('app', ['ui.router']).config(config).run(run).controller('mainController', Controller);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");
        $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: 'dashboard/index.html',
            controller: 'Dashboard.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'dashboard'
            }
        }).state('account', {
            url: '/account',
            templateUrl: 'account/index.html',
            controller: 'Account.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'account'
            }
        }).state('staff', {
            url: '/staff',
            templateUrl: 'users/index.html',
            controller: 'Users.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'staff'
            }
        }).state('players', {
            url: '/players',
            templateUrl: 'players/index.html',
            controller: 'Players.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'players'
            }
        }).state('judges', {
            url: '/judges',
            templateUrl: 'judges/index.html',
            controller: 'Judges.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'judges'
            }
        }).state('categories', {
            url: '/categories',
            templateUrl: 'categories/index.html',
            controller: 'Categories.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'categories'
            }
        }).state('verification', {
            url: '/verification',
            templateUrl: 'verification/index.html',
            controller: 'Verification.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'verification'
            }
        }).state('weight', {
            url: '/weight',
            templateUrl: 'weight/index.html',
            controller: 'Weight.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'weight'
            }
        }).state('fights', {
            url: '/fights',
            templateUrl: 'fights/index.html',
            controller: 'Fights.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'fights'
            }
        }).state('fights-service', {
            url: '/fights-service',
            templateUrl: 'fights_service/index.html',
            controller: 'FightsService.IndexController',
            controllerAs: 'vm',
            data: {
                activeTab: 'fights-service'
            }
        });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    function Controller($rootScope, $window, UserService, CompetitionService, FlashService, $location) {
        var vm = this;
        vm.user = {};
        vm.actualCompetition = {};
        vm.competitions = [];
        vm.isAdmin = false, vm.isWeight = false, vm.isVerification = false, vm.isFightService = false, vm.isResultsPreview = false;
        initController();
        vm.changeCompetition = changeCompetition;

        function initController() {
            angular.element('.datepicker').datepicker({
                format: 'mm/dd/yyyy'
            });
            UserService.GetCurrent().then(function(user) {
                vm.user = user;
                if (user.role == 'admin') {
                    vm.isAdmin = true;
                } else if (user.role == 'weight') {
                    vm.isWeight = true;
                    $location.path('/weight')
                } else if (user.role == 'verification') {
                    vm.isVerification = true;
                    $location.path('/verification')
                } else if (user.role == 'fight_service') {
                    vm.isFightService = true;
                    $location.path('/fights-service')
                } else if (user.role == 'results_preview') {
                    vm.isResultsPreview = true;
                    $location.path('/results-preview')
                }
            });
            getAllCompetitions();
        }

        function getAllCompetitions() {
            CompetitionService.GetAll().then(function(result) {
                vm.competitions = result;
                if (localStorage.actualCompetition) {
                    angular.forEach(result, function(value, key) {
                        if (value._id == localStorage.actualCompetition) {
                            vm.actualCompetition = vm.competitions[key];
                        }
                    });
                } else {
                    localStorage.setItem("actualCompetition", vm.competitions[0]._id);
                }
            });
        }

        function changeCompetition(competition) {
            vm.actualCompetition = competition;
            localStorage.actualCompetition = competition._id;
            location.reload();
        }
    }
    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function() {
        // get JWT token from server
        $.get('/app/token', function(token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });
})();