var shipApp = angular.module('phdShip', ['angular-bootstrap-select', "highcharts-ng", 'ngSanitize', 'hljs', 'daterangepicker']);

shipApp.controller('phdShipController', ['$scope', '$http', '$log', function ($scope, $http, $log) {
    //check if the ajax call is loading
    $scope.isLoading = true;
    //details for showing sql modal 
    $scope.modal = {};

    //options for each chart, in order to plot the chart
    $scope.reports = {};

    $scope.defaults = {};

    $scope.refreshed = Date.now();


    //defaults
    $scope.defaults = {
        compare: [
            "Year",
            "Site",
            "Device",
            "Experience",
            "None"
        ],
        and1: [
            "Year",
            "Site",
            "Device",
            "Experience",
            "None"
        ],
        and2: [
            "Year",
            "Site",
            "Device",
            "Experience",
            "None"
        ],
        site: [
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
        ],
        device: [
            "Mobile",
            "PC"
        ],
        experience: [
         "Unknown", "Apps: Android",
    "Apps: Other",
    "Apps: Windows Phone",
    "Apps: iPad",
    "Apps: iPhone",
    "Browser: Core Site",
    "Browser: mWeb"
        ],
        dateRangeConfig: {
            'minDate': '01/01/2013',
            'maxDate': moment($scope.refreshed),
            'showDropDowns': true,
            'drops': 'down',
            'opens': 'center right',
            'alwaysShowCalendars': true,
            'ranges': {
                'Latest Day': [moment($scope.refreshed), moment($scope.refreshed)],
                'Last 7 Days': [moment($scope.refreshed).subtract(6, 'days'), moment($scope.refreshed)],
                'Last 30 Days': [moment($scope.refreshed).subtract(29, 'days'), moment($scope.refreshed)],
                'This Month': [moment($scope.refreshed).startOf('month'), moment($scope.refreshed)],
                'Last Month': [moment($scope.refreshed).subtract(1, 'month').startOf('month'), moment($scope.refreshed).subtract(1, 'month').endOf('month')]
            }
        }
    };




    //options for deep dive modal
    $scope.modal.ddReports = {};

    $scope.ddReports = {};

    //result for selections
    $scope.result = {
        compare: "Year",
        and1: "None",
        and2: "None",
        siteSelection: [
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
    ],
        deviceSelection: ["Mobile",
            "PC"],
        experienceSelection: ["Unknown", "Apps: Android",
    "Apps: Other",
    "Apps: Windows Phone",
    "Apps: iPad",
    "Apps: iPhone",
    "Browser: Core Site",
    "Browser: mWeb"],
        dateSelection: {
            'startDate': moment($scope.refreshed).subtract(150, 'days'),
            'endDate': moment($scope.refreshed).subtract(50, 'days')
        },
        compareSelected: true,
        dmaChecked: false,
    };



    $scope.ddResult = {
        compare: true,
        and: "None",
        siteSelection: [
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
    ],
        dateSelection: {
            'startDate': moment($scope.refreshed).subtract(150, 'days'),
            'endDate': moment($scope.refreshed).subtract(50, 'days')
        },
        compareSelected: false
    };


    //get the selections and refresh the data
    $scope.apply = function () {
        $scope.isLoading = true;
        console.log($scope.result);
        var sites = $scope.result.siteSelection;
        var dateSelections = $scope.result.dateSelection;
        var dates = [];
        for (var index in dateSelections) {
            //console.log(dateSelections[index]);
            var date = moment(dateSelections[index]).format('YYYY-MM-DD');
            console.log(date)
            dates.push(date);
        }

        if ($scope.result.compare == 'Year') {
            for (var index in dateSelections) {
                var date = moment(dateSelections[index]);
                var lastYear = moment(date).subtract(365, 'days').format('YYYY-MM-DD');
                dates.push(lastYear);
            }
        }

        var query = getQuery();
        query.filter.fields[0].value = dates;
        query.filter.fields[1].value = sites;
        console.log(query);
        getChartConfig(query);
    }

    //load at the first time
    var query = getQuery();
    getChartConfig(query);

    function getChartConfig(query) {
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
            refreshData(query);
        });
    }


    function refreshData(query) {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/OLAPService/dataquery',
            data: query,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            var data = response.data;;
            //console.log(data);
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
            //console.log($scope.reports);
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
        //console.log(resultData);
        return resultData;
    };

    function calculate(record, expression) {
        //console.log(expression);
        if (expression.indexOf('divide') != -1) {
            var item = expression.substring(expression.indexOf('(') + 1, expression.length - 1);
            var numerator = record[item.split(',')[0]];
            var denominator = record[item.split(',')[1]];
            if (denominator == 0) {
                value = 0
            } else {
                var value = numerator / denominator;
            }

            value = parseFloat(value.toFixed(4));
            //console.log(value);
            // console.log(denominator);
            return value;
        } else {
            return record[expression];
        }
    }


    //deep dive apply
    $scope.ddApply = function () {
        //console.log($scope.ddResult);
        //console.log($scope.modal);
        //console.log($scope.modal.dd_id);
        //alert('sad');
        var sites = $scope.ddResult.siteSelection;
        var dateSelections = $scope.ddResult.dateSelection;
        var dates = [];
        for (var index in dateSelections) {
            var date = moment(dateSelections[index]).format('YYYY-MM-DD');
            //console.log(date);
            dates.push(date);
        }
        if ($scope.ddResult.compare == true) {
            for (var index in dateSelections) {
                var date = moment(dateSelections[index]);
                var lastYear = moment(date).subtract(365, 'days').format('YYYY-MM-DD');
                dates.push(lastYear);
            }

        }

        var query = getQuery();
        query.filter.fields[0].value = dates;
        query.filter.fields[1].value = sites;
        console.log(query);
        refreshDeepDiveDate(query);
    }


    function refreshDeepDiveDate(query) {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/OLAPService/dataquery',
            data: query,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            var data = response.data;;
            //console.log(data);
            var chartData = getDataByChartId(data, $scope.modal.dd_id, $scope.modal.dd_formula);
            var o = getDeepDiveOption();
            $scope.modal.ddReports.options = o;
            $scope.modal.ddReports.series = chartData;
        });
    };



}]);
