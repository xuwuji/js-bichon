//directive for phd filter, it contains selector, date-picker, check-box 
shipApp.directive('phdFilter', ['$timeout', '$http', function ($timeout, $http) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            defaults: '=',
            result: '=',
            apply: "&",
        },

        templateUrl: '/html/phd_filter.html',

        compile: function () {
            return {
                pre: function ($scope, iElement, iAttrs) {},

                post: function ($scope, iElement, iAttrs) {
                    var util = new arrayUtil();

                    //watch the compare selection,change the and1 behavior
                    $scope.$watch('result.compare', function (newV, oldV) {
                        var values = ['Year', 'Site', 'Device', 'Experience', 'None'];
                        if (newV == 'None') {
                            $scope.result.compareNotSelected = true;
                            $scope.result.and1NotSelected = true;
                        } else {
                            $scope.result.compareNotSelected = false;
                            values = util.removeItem(values, $scope.result.compare);
                            $scope.defaults.and1 = values;
                        }
                    });

                    //watch the and1 selection, change the and2 behavior
                    $scope.$watch('result.and1', function (newV, oldV) {
                        var values = ['Year', 'Site', 'Device', 'Experience', 'None'];
                        values = util.removeItem(values, $scope.result.compare);
                        if (newV == 'None') {
                            $scope.result.and1NotSelected = true;
                        } else {
                            $scope.result.and1NotSelected = false;
                            $scope.defaults.and2 = util.removeItem(values, $scope.result.and1);
                        }
                    });
                    $scope.$watch('result.dma', function (newValue, oldValue) {
                        if (newValue === oldValue) return;
                        $scope.$emit('phd.filter.toggle7DMA', newValue);
                    });
                }
            }
        },

    };
}]);


//directive for phd line chart
shipApp.directive('phdChart', ['$http', '$compile', function ($http, $compile) {
    return {
        restrict: 'E',
        templateUrl: '/html/phd_chart.html',
        scope: {
            chartConfig: "=",
            modal: "=",
        },
        link: function ($scope, element, attrs) {

            $scope.showSQL = function (chartId) {
                $http.get('http://localhost:58080/config/pageConfig/5').then(function (response) {
                    //console.log(response.data[chartId]);
                    var config = response.data[chartId];
                    var re = new RegExp('\n', 'g');
                    console.log($scope.modal);
                    $scope.modal.sql = config.chart_sql_desc;
                    $scope.modal.chart_desc = config.chart_desc;
                    $scope.modal.sql_fomula = config.sql_fomula;
                    $scope.modal.sql_contact = config.sql_contact;
                    $scope.modal.title = config.chart_title;
                    $scope.modal.downloadLink = "http://localhost:58080/download/sql?pageId=5&chartId=" + config.chart_id;
                });
            }

            $scope.showDD = function (chartId) {
                $http.get('http://localhost:58080/config/pageConfig/5').then(function (response) {
                    var config = $scope.chartConfig;
                    var config = response.data[chartId];
                    $scope.modal.dd_id = config.chart_id;
                    $scope.modal.dd_title = config.chart_title;
                    $scope.modal.dd_formula = config.chart_formula;
                });
            }

            //qtip for sql and deep dive button
            $(".sqlbtn").qtip({
                content: {
                    text: 'Show SQL'
                },
                position: {
                    at: 'bottom center'
                },
                style: {
                    classes: 'qtip-bootstrap'
                }
            });

            $(".deepdivebtn").qtip({
                content: {
                    text: 'Deep Dive'
                },
                position: {
                    at: 'bottom center'
                },
                style: {
                    classes: 'qtip-bootstrap'
                }
            });


            addChartDesc($scope, element, attrs);


            //add the chart desc qtip
            function addChartDesc($scope, element, attrs) {
                $http.get('http://localhost:58080/config/pageConfig/5').then(function (response) {
                    var config = response.data[$scope.chartConfig.id];
                    getLatestRefresh(response, config.chart_id);
                });
            };

            //get the latest date of each chart, should call the service
            function getLatestRefresh(response, chartId) {
                var url = 'http://localhost:58080/config/refresh?pageId=5&chartId=' + chartId;
                //console.log($scope.modal);
                $http.get(url).then(function (refreshData) {
                    var refresh = refreshData.data.refresh;
                    var config = response.data[chartId];
                    var chart_desc = config.chart_desc;
                    var container = element.find('.highcharts-container');
                    var titleContainer = container.find('.highcharts-title');
                    var titlePos = titleContainer.position();
                    if (titlePos == null) {
                        return;
                    }
                    var bbox = titleContainer[0].getBBox();
                    $scope.top = parseInt(bbox.y) + "px";
                    $scope.left = parseInt(bbox.x - 25) + "px";
                    $scope.width = parseInt(bbox.width + 50) + "px";
                    $scope.height = parseInt(bbox.height + 25) + "px";


                    //check if last refresh status
                    var diff = moment(refresh).diff(moment($scope.modal.to).subtract(2, 'days'),'days');
                    //console.log(diff);
                    var status;
                    if(diff<0){
                        status='<li style="color: red">';
                    }else{
                        status='<li style="color: green">';
                    }
                    
                    var descDiv = $('<div>' + chart_desc + '<hr><p>'+status+'<b style="color:black">Last Refresh : ' + refresh + '</b></li></p></div>');
                    
                    
                    $scope.maskStyle = {
                        "z-index": 20,
                        "position": "absolute",
                        "top": $scope.top,
                        "left": $scope.left,
                        "width": $scope.width,
                        "height": $scope.height,
                        "background-color": "white",
                        "opacity": 0
                    }
                    var div = element.find('.noteMaskDiv');
                    div.qtip({
                        content: {
                            title: 'Noted:',
                            text: descDiv.html(),
                        },
                        position: {
                            target: 'mouse'
                        },
                        style: {
                            classes: 'qtip-bootstrap'
                        }
                    });
                });
            }


        },
    }
}]);
