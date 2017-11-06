angular.module('cucikan-directive', [])
        .directive('itemOrder', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/directives/item-order.html'
            };
        })
        .directive('itemMobil', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/directives/item-mobil.html'
            };
        })
        .directive('itemBrandMobil', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/directives/item-brand-mobil.html'
            };
        })
        ;
