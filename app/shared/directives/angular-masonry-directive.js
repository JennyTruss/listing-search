(function() {
    "use strict";

    angular.module('masonry', ['ng']).directive('masonry', function($timeout) {
        return function(scope, element, attrs) {

            if (scope.$last){
                $timeout(function () {
                    var parent = element.parent();
                    var masonry = new Masonry(parent[0], {
                        itemSelector: '.card',
                        isAnimated: true,
                        animationOptions: {
                            duration: 750,
                            easing: 'linear',
                            queue: false
                        },
                        transitionDuration : "0.4s",
                        isResizable: false
                    });
                });
            }
        };
    })
})();
