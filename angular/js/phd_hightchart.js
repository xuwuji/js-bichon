var chartData = {
    name: '',
    data: [],
    color: '',
    dashStyle: '',
};

function getGroup(data) {
    var group = {
        "year": [],
        "other": [],
    };
    for (var key in data) {

        var date = key.substring(0, key.indexOf("_"));
        var other = key.substring(key.indexOf("_"));
        console.log(date);
        console.log(other);
        var year = key.substring(0, 4);
        group["year"][0] = date;
        if (date !== group["year"][0]) {
            group["year"][1] = date;
        }
    }
}

function genSeriesData(data, chartId, compareType) {
    getGroup(data);
    //console.log(data);
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
    fillData3 = {
        name: '',
        data: [],
        color: '#fffff',
        dashStyle: 'dot'
    };
    data = JSON.parse(data);
    var temp = "";
    for (var v in data) {
        temp = v.substring(0, 4);
        break;
    }
    $.each(data, function (date, value) {
        var record = [];
        if (date.indexOf(temp) != -1) {
            record[0] = date;
            record[1] = parseInt(value[chartId]);
            fillData1.data.push(record);
        } else {
            record[0] = date;
            record[1] = parseInt(value[chartId]);
            fillData2.data.push(record);
            fillData3.data.push(record);
        }
    });
    resultData = [];
    fillData1.data.sort(compare);
    fillData2.data.sort(compare);
    resultData.push(fillData1);
    resultData.push(fillData2);
    resultData.push(fillData3);
    //console.log(resultData);
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

function getChartsConfigByPageId(pageId) {
    return $.getJSON('http://localhost:8080/OLAPService/config/page/' + pageId);
}

function getOptionsForChartByChartId(chart, data, col) {
    var option = {
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
    }
    var resultData = genSeriesData(data, col);
    option.chart.renderTo = 'chart_' + chart.chart_id;
    option.title.text = chart.chart_title;
    option.series = resultData;
    return option;
}


function fillData() {
    var query = '{"source":"Mysql","queryType":"groupBy","dataSource":{"table":"src488","family":"fake"},"granularity":"day","dimensions":["0"],"filter":{"type":"and","fields":[{"type":"daterange","dimension":"0","value":["2016-01-01","2016-03-01","2015-01-01","2015-03-01"]},{"type":"selector","dimension":"1","value":["befr.ebay.be","benl.ebay.be","cafr.ebay.ca","ebay.at","ebay.ca","ebay.ch","ebay.co.uk","ebay.com","ebay.com.au","ebay.com.hk","ebay.com.my","ebay.com.sg","ebay.de","ebay.es","ebay.fr","ebay.ie","ebay.in","ebay.it","ebay.nl","ebay.ph","ebay.pl","others"]}]},"aggregations":[{"type":"doubleSum","name":"2","fieldName":"2"},{"type":"doubleSum","name":"3","fieldName":"3"},{"type":"doubleSum","name":"4","fieldName":"4"},{"type":"doubleSum","name":"5","fieldName":"5"},{"type":"doubleSum","name":"6","fieldName":"6"},{"type":"doubleSum","name":"7","fieldName":"7"},{"type":"doubleSum","name":"8","fieldName":"8"},{"type":"doubleSum","name":"9","fieldName":"9"},{"type":"doubleSum","name":"10","fieldName":"10"},{"type":"doubleSum","name":"11","fieldName":"11"},{"type":"doubleSum","name":"12","fieldName":"12"},{"type":"doubleSum","name":"13","fieldName":"13"},{"type":"doubleSum","name":"14","fieldName":"14"},{"type":"doubleSum","name":"15","fieldName":"15"},{"type":"doubleSum","name":"16","fieldName":"16"}]}';

    $.ajax({
        type: 'POST',
        data: query,
        url: 'http://localhost:8080/OLAPService/dataquery',
        contentType: 'application/json;charset=utf-8'
    }).done(function (data) {
        getChartsConfigByPageId(1).done(function (config) {
            $.each(config, function (index, chartConfig) {
                //get option for the chart
                var option = getOptionsForChartByChartId(chartConfig, data, index + 5);
                var chart = new Highcharts.Chart(option);
                //draw details for the chart
                var detail = new Detail(chart, chartConfig);
                detail.init();
            });
        });
    });
}




function Detail(chart, chartConfig) {
    this.chart = chart;
    this.chartConfig = chartConfig;
}


Detail.prototype = {
    init: function () {
        this.addChartDesc();
        this.addDeepDiveBtn();
        this.addSQLBtn();
    },
    //add the desc qtip for the chart 
    addChartDesc: function () {
        var container = $(this.chart.renderTo).find('.highcharts-container');
        var titleContainer = container.find('.highcharts-title');
        var titlePos = titleContainer.position();
        if (titlePos == null) {
            return;
        }
        var bbox = titleContainer[0].getBBox();
        var top = parseInt(bbox.y);
        var left = parseInt(bbox.x - 5);
        var width = parseInt(bbox.width + 10);
        var height = parseInt(bbox.height + 5);
        var noteMaskDiv = $('<div style="z-index:20;position: absolute;top:' + top + 'px;left:' + left + 'px;width:' + width + 'px;height:' + height + 'px;background-color:white;opacity:0"></div>');

        var descDiv = $('<div>' + this.chartConfig.chart_desc + '</div>');

        var statusDiv = '';

        descDiv.append(statusDiv);
        container.append(noteMaskDiv);

        noteMaskDiv.qtip({
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

    },
    //add the deep dive button for the chart
    addDeepDiveBtn: function () {
        $('.highchart_section').append('<div class="deepdivebtn" style="position: absolute; top:3px;right:3px; width: 24px; height: 24px; font-size: 16px; cursor: pointer; color: #ccc;"><i class="fa fa-plus-square-o" style="margin-left: 10px;" data-toggle="modal" data-target="#DDModal" onclick="showDD(' + this.chartConfig.chart_id + ',' + this.chartConfig.page_id + ')"></i></div>');

        $('.deepdivebtn').qtip({
            content: {
                text: '<div style="font-size:15px;text-aligen:center;height:50px;line-height:30px;width:100px">deep dive</div>'
            },
            position: {
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-bootstrap'
            }
        });

    },
    //add the show sql button for the chart
    addSQLBtn: function () {
        var div = '<div class="sqlbtn" style="position: absolute; bottom:3px;right:3px; width: 24px; height: 24px; font-size: 16px; cursor: pointer; color: #ccc;"><i class="fa fa-file-code-o" style="margin-left: 10px;" data-toggle="modal" data-target="#SQLModal" onclick="showSQL(' + this.chartConfig.chart_id + ',' + this.chartConfig.page_id + ')"></i></div>';
        var container = $(this.chart.renderTo).find('.highcharts-container');
        container.append(div);

        $('.sqlbtn').qtip({
            content: {
                text: '<div style="font-size:15px;text-aligen:center;height:50px;line-height:30px;width:100px">show sql</div>'
            },
            position: {
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-bootstrap'
            }
        });
    }
}


fillData();
