// supply open and close without load bootstrap.js
angular.module('angular-bootstrap-select.extra', [])
    .directive('toggle', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // prevent directive from attaching itself to everything that defines a toggle attribute
                if (!element.hasClass('selectpicker')) {
                    return;
                }

                var target = element.parent();
                var toggleFn = function () {
                    target.toggleClass('open');
                };
                var hideFn = function () {
                    target.removeClass('open');
                };

                element.on('click', toggleFn);
                element.next().on('click', hideFn);

                scope.$on('$destroy', function () {
                    element.off('click', toggleFn);
                    element.next().off('click', hideFn);
                });
            }
        };
    });

angular.module('angular-bootstrap-select', [])
    .directive('selectpicker', ['$log', '$parse', function ($log, $parse) {
        var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

        return {
            restrict: 'A',
            require: '?ngModel',
            compile: function (tElement, tAttrs, transclude) {
                //tElement.selectpicker($parse(tAttrs.selectpicker)());
                //tElement.selectpicker('refresh');
                return function (scope, element, attrs, ngModel) {
                    if (!ngModel) return;
                    var optionsExp = attrs.ngOptions;


                    //to make sure that once the options changes, the drop down changes automatically.
                    if ( optionsExp ){
                        var match = optionsExp.match(NG_OPTIONS_REGEXP);
                        if (!match) {
                            throw ngOptionsMinErr('iexp',
                                "Expected expression in form of " +
                                "'_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
                                " but got '{0}'. Element: {1}",
                                optionsExp, startingTag(selectElement));
                        }
                        var valuesFn = $parse(match[7]);

                        scope.$watch(valuesFn, function(n, o){
                            scope.$evalAsync(function() {
                                element.selectpicker('refresh');
                            });
                        });
                    }

                    if ( attrs.ngDisabled ) {
                        scope.$watch(attrs.ngDisabled, function (newVal, oldVal) {
                            scope.$evalAsync(function () {
                                element.selectpicker('refresh');
                            });
                        });
                    }

                    var oldRenderFn = ngModel.$render;

                    if ( attrs.multiple ) {
                        scope.$watchCollection(attrs.ngModel, function (newVal, oldVal) {
                            scope.$evalAsync(function () {
                                element.selectpicker('refresh');
                            });
                        });
                    }else{
                        scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                            if ( newVal == oldVal ) return;
                            scope.$evalAsync(function () {
                                element.selectpicker('refresh');
                            });
                        });
                    }

                    //get original $render function set by select directive.
                    ngModel.$render = function () {
                        scope.$evalAsync(function () {
                            if ( angular.isFunction(oldRenderFn) ) oldRenderFn();
                            element.selectpicker('refresh');
                        });
                    }

                    var selectGroup = $(element[0]).next('.btn-group');
                    $('html').on('click', function (e) {
                        if ($(e.target).closest(selectGroup[0]).length < 1) {
                            $(selectGroup[0]).removeClass('open');
                        }
                    });

                    function initElement(){
                        var options = {};
                        if(attrs.multiple) options.actionsBox = true;
                        if(attrs.width) options.width = attrs.width;
                        element.selectpicker(options);
                    }

                    initElement();
                };
            }

        };
    }]);
