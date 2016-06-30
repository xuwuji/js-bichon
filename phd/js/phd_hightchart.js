//options for high chart
var options = {
    chart: {
        renderTo: 'chart_',
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
    },
    report: {
        note: 'sd',
    }
}


function genSeriesData(data, chartId) {
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
    data = JSON.parse(data);
    $.each(data, function (date, value) {
        var record = [];
        if (date.indexOf('2016') != -1) {
            record[0] = date;
            record[1] = parseInt(value[chartId]);
            fillData1.data.push(record);
        } else {
            record[0] = date;
            record[1] = parseInt(value[chartId]);
            fillData2.data.push(record);
        }
    });
    resultData = [];
    fillData1.data.sort(compare);
    fillData2.data.sort(compare);
    resultData.push(fillData1);
    resultData.push(fillData2);
    console.log(resultData);
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

function initDeepDiveBtn() {
    $('.highchart_section').append('<div class="deepdivebtn" style="position: absolute; top:3px;right:3px; width: 24px; height: 24px; font-size: 16px; cursor: pointer; color: #ccc;"><i class="fa fa-plus-square-o" style="margin-left: 10px;"></i></div>');

    $('.deepdivebtn').qtip({
        content: {
            text: 'deep dive'
        },
        position: {
            at: 'bottom center'
        },
        style: {
            classes: 'qtip-bootstrap'
        }
    });
}




function getData() {
    var config = '{"source":"Mysql","queryType":"groupBy","dataSource":{"table":"src488","family":"fake"},"granularity":"day","dimensions":["0"],"filter":{"type":"and","fields":[{"type":"daterange","dimension":"0","value":["2016-01-01","2016-03-01","2015-01-01","2015-03-01"]},{"type":"selector","dimension":"1","value":["befr.ebay.be","benl.ebay.be","cafr.ebay.ca","ebay.at","ebay.ca","ebay.ch","ebay.co.uk","ebay.com","ebay.com.au","ebay.com.hk","ebay.com.my","ebay.com.sg","ebay.de","ebay.es","ebay.fr","ebay.ie","ebay.in","ebay.it","ebay.nl","ebay.ph","ebay.pl","others"]}]},"aggregations":[{"type":"doubleSum","name":"2","fieldName":"2"},{"type":"doubleSum","name":"3","fieldName":"3"},{"type":"doubleSum","name":"4","fieldName":"4"},{"type":"doubleSum","name":"5","fieldName":"5"},{"type":"doubleSum","name":"6","fieldName":"6"},{"type":"doubleSum","name":"7","fieldName":"7"},{"type":"doubleSum","name":"8","fieldName":"8"},{"type":"doubleSum","name":"9","fieldName":"9"},{"type":"doubleSum","name":"10","fieldName":"10"},{"type":"doubleSum","name":"11","fieldName":"11"},{"type":"doubleSum","name":"12","fieldName":"12"},{"type":"doubleSum","name":"13","fieldName":"13"},{"type":"doubleSum","name":"14","fieldName":"14"},{"type":"doubleSum","name":"15","fieldName":"15"},{"type":"doubleSum","name":"16","fieldName":"16"}]}';

    $.ajax({
        type: 'POST',
        data: config,
        url: 'http://localhost:8080/OLAPService/dataquery',
        contentType: 'application/json;charset=utf-8'
    }).done(function (data) {
        //console.log(data);
        var resultData = genSeriesData(data, "2");
        options.chart.renderTo = options.chart.renderTo + "2";
        options.title.text = '%HP Visitors Who Search'
        '%HP Visitors Who Search';
        options.series = resultData;
        new Highcharts.Chart(options);
        initDeepDiveBtn();
    });
}


getData();
