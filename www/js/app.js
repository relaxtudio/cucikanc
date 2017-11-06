// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cucikan', ['ionic', 'cucikan-config', 'cucikan-controllers', 'cucikan-service'])

    .run(function($ionicPlatform, $rootScope, $state, $ws) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            // console.log('test isLogin',$ws.isLogin());
            if ($ws.isLogin()) {
                $state.transitionTo("app.details");
            }
        });

        $rootScope.$on("$stateChangeStart", function (event, toState) {
            
            if (toState.authenticate && !$ws.isLogin()) {
                $state.transitionTo("blank");
                event.preventDefault();
            }

            if (!toState.authenticate && $ws.isLogin()) {
                $state.transitionTo("app.details");
                event.preventDefault();
            }
            // console.log('state: ', toState.authenticate, $ws.isLogin());
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl',
                authenticate: true
            })

            .state('blank', {
                url: '/blank',
                templateUrl: 'templates/blank.html',
                controller: 'BlankCtrl',
                authenticate: false
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                authenticate: false
            })

            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller: 'SignupCtrl',
                authenticate: false
            })

            .state('forgot', {
                url: '/forgot',
                templateUrl: 'templates/forgot.html',
                controller: 'ForgotCtrl',
                authenticate: false
            })

            .state('app.details', {
                url: '/details',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/details.html',
                        controller: 'DetailsCtrl'
                    }
                },
                authenticate: true
            })

            .state('app.order', {
                url: '/order',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/order.html',
                        controller: 'OrderCtrl'
                    }
                },
                authenticate: true
            })

            .state('app.mobil', {
                url: '/mobil',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/mobil.html',
                        controller: 'MobilCtrl'
                    }
                },
                authenticate: true
            })

            .state('app.mobilform', {
                url: '/mobil',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/mobil-form.html',
                        controller: 'MobilFormCtrl'
                    }
                },
                authenticate: true
            })

            .state('app.profile', {
                url: '/profile',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    }
                },
                authenticate: true
            })

            .state('app.pass', {
                url: '/pass',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/pass.html',
                        controller: 'PassCtrl'
                    }
                },
                authenticate: true
            });
        $urlRouterProvider.otherwise('/app/details');
    });
