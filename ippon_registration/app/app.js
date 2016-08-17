﻿(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: 'dashboard/index.html',
                controller: 'Dashboard.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'dashboard' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            })            
            .state('users', {
                url: '/users',
                templateUrl: 'users/index.html',
                controller: 'Users.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'users' }
            })
            .state('players', {
                url: '/players',
                templateUrl: 'players/index.html',
                controller: 'Players.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'players' }
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });
})();