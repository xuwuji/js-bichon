var shipApp = angular.module('phdShip', ['angular-bootstrap-select', "highcharts-ng", 'ngSanitize', 'hljs']);

shipApp.controller('phdShipController', ['$scope', '$http', function ($scope, $http) {
    //check if the ajax call is loading
    $scope.isLoading = true;
    //details for showing sql modal 
    $scope.sqlModal = {};
    //query
    $scope.query = {
        "source": "Mysql",
        "queryType": "groupBy",
        "dataSource": {
            "table": "src488",
            "family": "fake"
        },
        "granularity": "day",
        "dimensions": [
        "0"
    ],
        "filter": {
            "type": "and",
            "fields": [
                {
                    "type": "daterange",
                    "dimension": "0",
                    "value": [
                    "2016-03-01",
                    "2016-06-01",
                    "2015-03-01",
                    "2015-06-01"
                ]
            },
                {
                    "type": "selector",
                    "dimension": "1",
                    "value": [
                    "befr.ebay.be",
                    "benl.ebay.be",
                    "cafr.ebay.ca",
                    "ebay.at",
                    "ebay.ca",
                    "ebay.ch",
                    "ebay.co.uk",
                    "ebay.com",
                    "ebay.com.au",
                    "ebay.com.hk",
                    "ebay.com.my",
                    "ebay.com.sg",
                    "ebay.de",
                    "ebay.es",
                    "ebay.fr",
                    "ebay.ie",
                    "ebay.in",
                    "ebay.it",
                    "ebay.nl",
                    "ebay.ph",
                    "ebay.pl",
                    "others"
                ]
            }
        ]
        },
        "aggregations": [
            {
                "type": "doubleSum",
                "name": "2",
                "fieldName": "2"
        },
            {
                "type": "doubleSum",
                "name": "3",
                "fieldName": "3"
        },
            {
                "type": "doubleSum",
                "name": "4",
                "fieldName": "4"
        },
            {
                "type": "doubleSum",
                "name": "5",
                "fieldName": "5"
        },
            {
                "type": "doubleSum",
                "name": "6",
                "fieldName": "6"
        },
            {
                "type": "doubleSum",
                "name": "7",
                "fieldName": "7"
        },
            {
                "type": "doubleSum",
                "name": "8",
                "fieldName": "8"
        },
            {
                "type": "doubleSum",
                "name": "9",
                "fieldName": "9"
        },
            {
                "type": "doubleSum",
                "name": "10",
                "fieldName": "10"
        },
            {
                "type": "doubleSum",
                "name": "11",
                "fieldName": "11"
        },
            {
                "type": "doubleSum",
                "name": "12",
                "fieldName": "12"
        },
            {
                "type": "doubleSum",
                "name": "13",
                "fieldName": "13"
        },
            {
                "type": "doubleSum",
                "name": "14",
                "fieldName": "14"
        },
            {
                "type": "doubleSum",
                "name": "15",
                "fieldName": "15"
        },
            {
                "type": "doubleSum",
                "name": "16",
                "fieldName": "16"
        }
    ]
    };
    $scope.query.sites = [];
    $scope.query.devices = [];
    $scope.query.experiences = [];
    $scope.query.compare = [{
        display: 'None',
        value: 'None'
                    }, {
        display: 'Year',
        value: 'Year'
                    }, {
        display: 'Site',
        value: 'Site'
                    }];
    $scope.query.and = [];

    //result for selections
    $scope.result = {};
    //options for each chart, in order to plot the chart
    $scope.reports = {};

    //declare the query default value
    function initFilter($http) {
        $http.get('http://localhost:8080/OLAPService/config/filter/488').then(function (response) {
            console.log(response.data);

            //sites
            angular.forEach(response.data.site, function (item) {
                // console.log(item);
                var site = {
                        display: item,
                        value: item
                    }
                    //console.log(site);
                $scope.query.sites.push(site);
            });

            //devices
            angular.forEach(response.data.device, function (item) {
                // console.log(item);
                var device = {
                        display: item,
                        value: item
                    }
                    //console.log(site);
                $scope.query.devices.push(device);
            });

            //experiences
            angular.forEach(response.data.experience, function (item) {
                // console.log(item);
                var experience = {
                        display: item,
                        value: item
                    }
                    //console.log(site);
                $scope.query.experiences.push(experience);
            });
        });

    }

    initFilter($http);

    getChartConfig();

    function getChartConfig() {
        //1.get configs for this page, it contains each chart's config
        $http.get('http://localhost:8080/OLAPService/config/pageConfig/5').then(function (response) {
            //console.log(response.data);
            var configs = response.data;
            //console.log(configs);
            for (var index in configs) {
                var item = configs[index];
                //$scope.pageConfig[index] = item;
                var chart_id = item.chart_id;
                //2.put each chart config into a map,chart id <-> chart option
                $scope.reports[chart_id] = {
                    id: item.chart_id,
                    title: item.chart_title,
                    sql: item.chart_sql_desc,
                    title_desc: item.chart_desc,
                    formula: item.chart_formula,
                };
            }
            //console.log($scope.reports);
        }).then(function () {
            //3.get Data for this page and set each chart's data
            refreshData();
        });
    }


    function refreshData() {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/OLAPService/dataquery',
            data: $scope.query,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            var data = response.data;;
            console.log(data);
            for (var chartId in $scope.reports) {
                var item = $scope.reports[chartId];
                //console.log(item.formula);
                var chartData = getDataByChartId(data, item.id, item.formula);
                var o = getOption();
                o.tooltip.title = item.title;
                $scope.reports[chartId].id = chartId;
                $scope.reports[chartId].options = o;
                $scope.reports[chartId].title = {
                    text: item.title
                };
                $scope.reports[chartId].series = chartData;
            }
            console.log($scope.reports);
            $scope.isLoading = false;
        });
    }

    //generate data by chart id
    function getDataByChartId(data, chartId, expression) {
        fillData1 = {
            name: '',
            data: [],
            color: '#000000'
        };

        fillData2 = {
            name: '',
            data: [],
            color: '#7cb5ec',
            dashStyle: 'dot'
        };

        // console.log(data);
        for (var date in data) {
            //console.log(date);
            var record = data[date]
                //console.log();
            var value = calculate(record, expression);
            if (date.indexOf('2016') == -1) {
                var point = [];
                point[0] = date;
                point[1] = value;
                fillData2.data.push(point);
            } else {
                var point = [];
                point[0] = date;
                point[1] = value;
                fillData1.data.push(point);
            }
        }
        //console.log(fillData1);
        var resultData = [];
        fillData1.data.sort(compare);
        fillData2.data.sort(compare);
        resultData.push(fillData1);
        resultData.push(fillData2);
        console.log(resultData);
        return resultData;
    };

    function calculate(record, expression) {
        console.log(expression);
        if (expression.indexOf('divide') != -1) {
            var item = expression.substring(expression.indexOf('(') + 1, expression.length - 1);
            var numerator = record[item.split(',')[0]];
            var denominator = record[item.split(',')[1]];
            console.log(numerator);
            console.log(denominator);
            if (denominator == 0) {
                value = 0
            } else {
                var value = numerator / denominator;
            }

            value = parseFloat(value.toFixed(4));
            console.log(value);
            // console.log(denominator);
            return value;
        } else {
            return record[expression];
        }
    }

}]);
