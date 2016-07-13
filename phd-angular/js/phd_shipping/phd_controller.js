var shipApp = angular.module('phdShip', ['angular-bootstrap-select']);

shipApp.controller('phdShipController', ['$scope', '$http', function ($scope, $http) {
    //declare the query default value
    $scope.query = {};
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
    $scope.result = {};

    function initFilter($http) {
        $http.get('http://localhost:8080/OLAPService/config/filter/124').then(function (response) {
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

    //normal option for each chart
    Option = {
        chart: {
            renderTo: '',
            zoomType: 'xy'

        },
        series: [],
        exporting: {
            buttons: {
                customButton: {
                    x: -62,
                    onclick: function () {
                        alert('Clicked');
                    },
                    symbol: 'circle'
                }
            }
        },
        title: {
            text: '',
            style: {
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fontSize: '13px',
                color: '#555'
            }
        },
        yAxis: {
            title: {
                text: null
            }
        },
        xAxis: {
            labels: {
                enabled: false
            },
            tickLength: 0,
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: ' ',
                day: '%b %e',
                month: '%b \'%y',
                year: '%Y'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        //Options for the tooltip that appears when the user hovers over a series or point.
        tooltip: {
            useHTML: true,
            shared: true,
            crosshairs: true,
            formatter: function () {
                if (this.series != undefined)
                    if (this.series.name != undefined && this.series.name == 'flag-name')
                        return false;

                var point = [];
                var ret = '<div style="min-width: 150px;white-space:normal; ">' + '%HP Visitors Who Search' + '</div>';
                //collect x/y of this point and push them into one array
                $.each(this.points, function (idx, p) {
                    var info = {
                        yValue: p.y,
                        color: p.series.color,
                        name: p.series.name,
                        xValue: p.key
                    };
                    point.push(info);
                });

                $.each(point, function (idx, point) {
                    ret += '<span style="color:' + point.color + '">' + moment(point.xValue).format("YYYY-MM-DD") + '</span>: <b>' + point.yValue + '</b><br/>';
                });
                return ret;
            }
        }
    };

    $scope.reports = {

    };


    function getChartConfig() {
        //1.get configs for this page, it contains each chart's config
        $http.get('http://localhost:8080/OLAPService/config/pageConfig/1').then(function (response) {
            //console.log(response.data);
            var configs = response.data;
            console.log(configs);
            for (var index in configs) {
                var item = configs[index];
                var chart_id = item.chart_id;
                //2.put each chart config into a map,chart id <-> chart option
                $scope.reports[chart_id] = {

                };
            }
            console.log($scope.reports);
        }).then(function () {
            //3.get Data
            getPageData();
        });
    }

    getChartConfig();

    //getPageData();

    function getPageData() {
        var query = '{"source":"Mysql","queryType":"groupBy","dataSource":{"table":"src488","family":"fake"},"granularity":"day","dimensions":["0"],"filter":{"type":"and","fields":[{"type":"daterange","dimension":"0","value":["2016-01-01","2016-03-01","2015-01-01","2015-03-01"]},{"type":"selector","dimension":"1","value":["befr.ebay.be","benl.ebay.be","cafr.ebay.ca","ebay.at","ebay.ca","ebay.ch","ebay.co.uk","ebay.com","ebay.com.au","ebay.com.hk","ebay.com.my","ebay.com.sg","ebay.de","ebay.es","ebay.fr","ebay.ie","ebay.in","ebay.it","ebay.nl","ebay.ph","ebay.pl","others"]}]},"aggregations":[{"type":"doubleSum","name":"2","fieldName":"2"},{"type":"doubleSum","name":"3","fieldName":"3"},{"type":"doubleSum","name":"4","fieldName":"4"},{"type":"doubleSum","name":"5","fieldName":"5"},{"type":"doubleSum","name":"6","fieldName":"6"},{"type":"doubleSum","name":"7","fieldName":"7"},{"type":"doubleSum","name":"8","fieldName":"8"},{"type":"doubleSum","name":"9","fieldName":"9"},{"type":"doubleSum","name":"10","fieldName":"10"},{"type":"doubleSum","name":"11","fieldName":"11"},{"type":"doubleSum","name":"12","fieldName":"12"},{"type":"doubleSum","name":"13","fieldName":"13"},{"type":"doubleSum","name":"14","fieldName":"14"},{"type":"doubleSum","name":"15","fieldName":"15"},{"type":"doubleSum","name":"16","fieldName":"16"}]}';
        $http({
            method: 'POST',
            url: 'http://localhost:8080/OLAPService/dataquery',
            data: query,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            var data = response.data;
            var chartData = getDataByChartId(data, 1, 2);
            console.log($scope.reports);
            for (var chartId in $scope.reports) {
                console.log(chartId);
                var o = Option;
                o.title.text = chart.chart_title;
                o.series = resultData;
                $scope.reports[chartId] =
            }

            //console.log(resultData);
        });
    }

    //generate data by chart id
    function getDataByChartId(data, chartId, colId) {
        fillData1 = {
            name: '',
            data: [],
            color: '#7cb5ec'
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
            var value = record[colId];
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
        resultData = [];
        fillData1.data.sort(compare);
        fillData2.data.sort(compare);
        resultData.push(fillData1);
        resultData.push(fillData2);
        return resultData;
    }

    //sort array based on time(first element)
    function compare(a, b) {
        if (a[0] < b[0])
            return -1;
        if (a[0] > b[0])
            return 1;
        return 0;
    }

    //caculate the data for the chart by chart id
    function ChartDataById() {

    }
}]);
