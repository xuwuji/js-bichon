var shipApp = angular.module('phdShip', ['angular-bootstrap-select', "highcharts-ng", 'ngSanitize', 'hljs', 'daterangepicker']);

shipApp.controller('phdShipController', ['$scope', '$http', '$log', function ($scope, $http, $log) {
    //check if the ajax call is loading
    $scope.isLoading = true;
    //options for each chart, in order to plot the chart
    $scope.reports = {};
    //today
    $scope.refreshed = Date.now();
    //defaults for filter
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


    //result for filter selections
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
        compareNotSelected: true,
        dma: false,
        mmd: false,
    };



    //details for show sql & deep dive modal 
    $scope.modal = {};

    //chart config for deep dive modal
    $scope.modal.ddReports = {};

    //deep dive filter selection
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





    //load at the first time
    var defaultUrl = getSelection();
    getChartConfig(defaultUrl);



    function getSelection() {
        var result = $scope.result;
        var from = moment(result.dateSelection.startDate).format('YYYY-MM-DD');
        var to = moment(result.dateSelection.endDate).format('YYYY-MM-DD');
        var site = result.siteSelection;
        var device = result.deviceSelection;
        var experience = result.experienceSelection;
        var compare = result.compare;
        var and1 = result.and1;
        var and2 = result.and2;
        //        console.log('-------------------------');
        //        console.log(result);
        //        console.log(from);
        //        console.log(to);
        //        console.log(site);
        //        console.log(device);
        //        console.log(experience);
        //        console.log('-------------------------');
        var url = 'http://localhost:58080/phdService/dashboard/cc?from={from}&to={to}&site={site}&device={device}&experience={experience}&compare={compare}&and1={and1}&and2={and2}';
        url = url.replace('{from}', from);
        url = url.replace('{to}', to);
        url = url.replace('{site}', site);
        url = url.replace('{device}', device);
        url = url.replace('{experience}', experience);
        url = url.replace('{compare}', compare);
        url = url.replace('{and1}', and1);
        url = url.replace('{and2}', and2);
        console.log(url);
        return url;
    }

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
            method: 'GET',
            url: query
        }).then(function (response) {
            var data = response.data;;
            console.log(data);
            for (var chartId in $scope.reports) {
                var item = $scope.reports[chartId];
                //console.log(item.formula);
                var chartData = getDataByChartId(data, item.id, item.formula, false);
                //console.log(chartData);
                var o = getOption(item.title);

                $scope.reports[chartId].options = o;
                $scope.reports[chartId].title = {
                    text: item.title
                };
                $scope.reports[chartId].series = chartData;
            }
            console.log($scope.reports);
            $scope.isLoading = false;
        }).then(function () {
            addAnnotation();
        });
    }

    function getDataByChartId(jsondata, chartId, expression, isavg) {
        //divide
        var predata = [];
        for (var rowKey in jsondata) {
            if (jsondata.hasOwnProperty(rowKey)) {
                var tuple = jsondata[rowKey];

                var oneResult = calculate(tuple, expression);
                if (oneResult != '') {
                    predata.push([rowKey, oneResult]);
                }

            }
        }
        //console.log(predata);

        //deal with group
        var groupTemp = [];
        predata.forEach(function (row) {
            var rowKey = row[0];
            var groupName = rowKey.substring(11) != "" && rowKey.substring(11) != null ? rowKey.substring(11) : "default";
            var rowVal = row[1];
            var resultCluster = [];
            if (typeof (groupTemp[groupName]) != "undefined") {
                var resultCluster = groupTemp[groupName];
            }
            //resultCluster[rowKey]=rowdata;
            resultCluster.push([rowKey, rowVal]);
            groupTemp[groupName] = resultCluster;
        });

        var rawdata = [];
        for (var groupName in groupTemp) {
            rawdata.push([groupName, groupTemp[groupName]]);
        }

        //parameters
        var start = $scope.result.dateSelection.startDate; //should be passed through parameters
        var end = $scope.result.dateSelection.endDate; //should be passed through parameters


        //divide results -> data for chart
        var firstday = moment(start).subtract(1, 'days').format('YYYY-MM-DD');
        var lastday = end;
        var llastday = moment(lastday).subtract(363, 'days').format('YYYY-MM-DD');

        var seriesColors = ['#62A6E7', '#f7a35c', '#90ed7d', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1', '#434348'];
        var colorCount = 0;
        var chartdata = [];
        rawdata.forEach(function (group) {
            var yoydata = [];
            var yoydata1 = [];
            group[1].forEach(function (ele) {
                var date = moment(ele[0].substring(0, 10)).format('YYYY-MM-DD');
                if (date > firstday) {
                    yoydata.push(ele)
                }
                if (date < llastday) {
                    yoydata1.push(ele)
                }
            });
            //sort the array by date
            yoydata.sort(compare);
            yoydata1.sort(compare);
            if (isavg) {
                yoydata = nDayAvg(7, yoydata);
                yoydata1 = nDayAvg(7, yoydata1);
            }
            var groupData = {
                name: group[0],
                data: yoydata,
                color: seriesColors[colorCount]
            }
            chartdata.push(groupData);
            var groupDataYoy = {
                name: group[0],
                data: yoydata1,
                dashStyle: 'dot',
                color: seriesColors[colorCount]
            }
            chartdata.push(groupDataYoy);
            colorCount++;
            if (colorCount > 9) colorCount = 0;
        });

        return chartdata;

    }
    //7dma
    function nDayAvg(n, data) {
        var nDMA = data;
        for (var dataCount = nDMA.length - 1; dataCount >= 0; dataCount--) {
            var valBefore = nDMA[dataCount][1];
            var valAfter = 0;
            var valSum = 0;
            if (dataCount >= 7) {
                for (count = 1; count < n; count++) {
                    valSum += nDMA[dataCount - count][1];
                    valAfter = (valSum + valBefore) / n;
                }
            } else if (dataCount > 0) {
                for (count = 1; count < dataCount + 1; count++) {
                    valSum += nDMA[dataCount - count][1];
                    valAfter = (valSum + valBefore) / (dataCount + 1);
                }
            } else {
                valAfter = valBefore;
            }
            nDMA[dataCount][1] = valAfter;
        }
        return nDMA;
    }

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

    function addAnnotation() {

        var start = moment($scope.result.dateSelection.startDate).format('YYYY-MM-DD');
        var end = moment($scope.result.dateSelection.endDate).format('YYYY-MM-DD');
        //var start = '2015-07-01';
        //var end = '2015-07-25';
        $http({
            method: 'GET',
            url: 'http://nous.corp.ebay.com/nousfeservice/annotation?end=' + end + '&start=' + start + '&targetId=DemoDD.dream',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            var data = response.data;
            //$.getJSON('//nous.corp.ebay.com/nousfeservice/annotation?end='+end+'&start='+start+'&targetId=DemoDD.dream', function(data){

            //should be passed through parameters

            var reports = $scope.reports;
            var tabId = '516'; //513 is for shipping tab
            //tab id should be added into chart_config

            var wdata = {};
            //var annotations=sortAnnotations(data);
            data.forEach(function (ele) {
                if (!wdata.hasOwnProperty(ele.targetId)) {
                    wdata[ele.targetId] = [];
                }
                wdata[ele.targetId].push(ele);
            });

            for (var idx in reports) {
                if (reports.hasOwnProperty(idx)) { //can be ignored?
                    var curadapter = reports[idx];
                    //if(curadapter.rpt_type=='highchart'){

                    if (!wdata.hasOwnProperty('DemoDD.dream.' + tabId + '_' + curadapter.id))
                        continue;

                    var anns = wdata['DemoDD.dream.' + tabId + '_' + curadapter.id];

                    var flagData = [];
                    anns.forEach(function (elee1) {
                        var ddate = elee1.startx;
                        var xx = 0;

                        if (ddate >= start && ddate <= end) {
                            xx = (new Date(ddate) - new Date(start)) / 1000 / 24 / 3600;
                        } else
                            return;

                        flagData.push({
                            aid: elee1.id,
                            filterInfo: elee1.filterInfo,
                            title: " ",
                            x: xx
                        });
                    });

                    //console.log('----------------------------------------------------------------------- report');

                    var siteFilters = $scope.result.siteSelection;
                    var deviceFilters = $scope.result.deviceSelection;
                    var experienceFilters = $scope.result.experienceSelection;



                    var daterange = {
                        startDate: new Date(start).getTime() + 24 * 3600 * 1000,
                        endDate: new Date(end).getTime() + 24 * 3600 * 1000
                    };

                    var thefilters = [];
                    var orifilter = {};
                    orifilter['site'] = {
                        'value': siteFilters
                    }; //site = ele.dimension??? siteFilters = ele.value;???
                    orifilter['device'] = {
                        'value': deviceFilters
                    };
                    orifilter['experience'] = {
                        'value': experienceFilters
                    };

                    thefilters.push(orifilter);




                    var isyoy = false;
                    var is7dma = false;

                    if ($scope.result.dmaChecked == true) {
                        is7dma = true;
                    }

                    if ($scope.result.compare == 'Year' || $scope.result.and1 == 'Year' || $scope.result.and2 == 'Year') {

                        isyoy = true;
                    }

                    //              var ssid = $(this).attr('srcid');
                    var ssid = '488'; //'124';//should be in config file???

                    var secidx = curadapter.id;

                    //var closure=function(secidx){
                    var ggdata = {
                        name: 'flag-name',
                        type: 'flags',
                        width: 17,
                        height: 16,
                        y: -18,
                        cursor: 'pointer',
                        showInLegend: false,
                        shape: 'url(img/icon-annotation.png)', //anno???
                        data: flagData,
                        point: {
                            events: {
                                click: function (evt) {
                                    var filterInfo = JSON.parse(this.filterInfo);

                                    var daterange = {};
                                    var filters_temp = [];
                                    for (var i = 0; i < filterInfo.reports.length; i++) {
                                        var report = filterInfo.reports[i];
                                        var filter = {};
                                        for (var filterProp in report) {
                                            if (report.hasOwnProperty(filterProp)) {
                                                var value = report[filterProp];
                                                if (filterProp == 'dateRange') {
                                                    daterange.startDate = value.startDate;
                                                    daterange.endDate = value.endDate;
                                                } else if (filterProp == 'aggrindi') {
                                                    // do nothing
                                                } else {
                                                    filter[filterProp] = {};
                                                    filter[filterProp].value = value;
                                                }
                                            }
                                        }

                                        filters_temp.push(filter);
                                    }


                                    //open deepdive page??
                                    //if(secidx==19||secidx==20){
                                    //     ssid = 501;
                                    //}

                                    $scope.showDeepDive(secidx, filters_temp, daterange, g_page_id, filterInfo.enableYOY, is7dma, ssid);
                                }
                            }
                        }
                    };
                    console.log('ggdata:' + ggdata);
                    //addSeries(idx,ggdata);
                    $scope.reports[idx].series.push(ggdata);
                    //addSeries(idx,$scope.reports[idx].series[0]);
                    //curadapter.series.push(ggdata);
                    console.log($scope.reports);
                    //}(secidx);

                    //}

                }
            }

        });
    }



    //get the filter selections and refresh the data on the dashboard
    $scope.apply = function () {
        $scope.isLoading = true;
        console.log($scope.result);
        var sites = $scope.result.siteSelection;
        var dateSelections = $scope.result.dateSelection;
        var dates = [];
        for (var index in dateSelections) {
            var date = moment(dateSelections[index]).format('YYYY-MM-DD');
            dates.push(date);
        }

        if ($scope.result.compare == 'Year' || $scope.result.and1 == 'Year' || $scope.result.and2 == 'Year') {
            for (var index in dateSelections) {
                var date = moment(dateSelections[index]);
                var lastYear = moment(date).subtract(365, 'days').format('YYYY-MM-DD');
                dates.push(lastYear);
            }
        }

        var query = getSelection();
        getChartConfig(query);
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
