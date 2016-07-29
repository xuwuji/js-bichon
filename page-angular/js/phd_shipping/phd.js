//normal option for each chart
function getOption(tooltipTitle) {
    var Option = {
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
            },
            labels: {
                formatter: function () {
                    if (this.value >= 1000000) {
                        return (this.value / 1000000)
                            .toFixed(0) + 'm';
                    } else if (this.value >= 1000) {
                        return (this.value / 1000).toFixed(0) + 'k';
                    } else if (this.value < 1) {
                        return (this.value * 100).toFixed(1) + '%';
                    } else {
                        return this.value;
                    }
                }

            },
            gridLineColor: '#f0f0f0',
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
                //console.log(this);
                if (this.series != undefined)
                    if (this.series.name != undefined && this.series.name == 'flag-name')
                        return false;

                var point = [];
                var ret = '<div style="min-width: 150px;white-space:normal; ">' + tooltipTitle + '</div>';
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
                    //console.log(point);
                    //ret = '';
                    if (point.yValue < 1) {
                        ret += '<span style="color:' + point.color + '">' + (point.xValue) + '</span>: <b>' + ((point.yValue) * 100).toFixed(2) + '%</b><br/>';

                    } else {
                        ret += '<span style="color:' + point.color + '">' + (point.xValue) + '</span>: <b>' + (point.yValue) + '%</b><br/>';
                    }
                });
                return ret;
            }
        }
    };
    return Option;
}


//normal deep dive option for each chart
function getDeepDiveOption() {
    var Option = {
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
            },
            labels: {
                formatter: function () {
                    if (this.value >= 1000000) {
                        return (this.value / 1000000)
                            .toFixed(0) + 'm';
                    } else if (this.value >= 1000) {
                        return (this.value / 1000).toFixed(0) + 'k';
                    } else if (this.value < 1) {
                        return (this.value * 100).toFixed(1) + '%';
                    } else {
                        return this.value;
                    }
                }

            },
            gridLineColor: '#f0f0f0',
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
                //console.log(this);
                if (this.series != undefined)
                    if (this.series.name != undefined && this.series.name == 'flag-name')
                        return false;

                var point = [];
                var ret = '<div style="min-width: 150px;white-space:normal; ">' + 'title' + '</div>';
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
                    //ret = '';
                    if (point.yValue < 1) {
                        ret += '<span style="color:' + point.color + '">' + moment(point.xValue).format("YYYY-MM-DD") + '</span>: <b>' + ((point.yValue) * 100).toFixed(2) + '%</b><br/>';

                    } else {
                        ret += '<span style="color:' + point.color + '">' + moment(point.xValue).format("YYYY-MM-DD") + '</span>: <b>' + (point.yValue) + '%</b><br/>';
                    }
                });
                return ret;
            }
        },
        report: {
            buttons: [
            {
                icon: '<i class="fa fa-cloud-download" style="width: 26px"></i>',
                text: 'Report Data',
                onclick: function () {
                    var chart = this,
                        userOptions = chart.userOptions,
                        report = userOptions.report,
                        indi = report.indi,
                        series = chart.series;
                    var data = {},
                        csvTilte = ['date'];
                    _.each(series, function (aSeries) {
                        var title = aSeries.options.title,
                            name = aSeries.options.name,
                            seriesData = aSeries.options.data,
                            seriesType = aSeries.options.type;

                        if (seriesType !== 'flags' && !!seriesData) {
                            var idx = _.indexOf(csvTilte, title + ' / ' + name);
                            if (idx == -1) {
                                var length = csvTilte.push(title + ' / ' + name);
                                idx = length - 1;
                            }
                            _.each(seriesData, function (pointData) {
                                var row = data[pointData.name] = data[pointData.name] || [pointData.name];
                                row[idx] = pointData.y;
                            });
                        }
                    });

                    data = _.sortBy(data, function (num, idx) {
                        return idx
                    });
                    var csvData = csvTilte.join();
                    _.each(data, function (val) {
                        csvData += '\r\n' + val.join();
                    });
                    console.log(csvData);
                    var b = new Blob([csvData]);
                    window.saveAs(b, 'report_data.csv');
                }
            },
            {
                icon: '<i class="fa fa-download" style="width: 26px"></i>',
                text: 'Raw Data',
                onclick: function () {


                    var chart = this,
                        userOptions = chart.userOptions,
                        report = userOptions.report,
                        indi = report.indi,
                        series = chart.series,
                        data = {},
                        metrics = [];

                    var yanjtitle = "date";
                    var datastr = "";
                    var dataobj = {};
                    var metrics = [];
                    var metricidxs = [];

                    _.each(series, function (aSeries) {
                        var title = aSeries.options.title,
                            name = aSeries.options.name,
                            seriesData = aSeries.options.data,
                            seriesType = aSeries.options.type,
                            rawData = aSeries.options.rawData,
                            aggr = aSeries.options.aggr,
                            queryId = aSeries.options.queryId;

                        var g_meta = aSeries.options.g_meta;

                        // var numb = txt.match(/\d/g);
                        
                        //yanjtmp
                        if(name!=undefined&&rawData!=undefined){

                            metricidxs = aggr.match(/\d+/g);
                            metrics = metricidxs;
                            

                            //                  yanjtitle += ","+name;
                            metrics.forEach(function(ele){
                                yanjtitle += ","+name+"/"+g_meta['val_colidx_name_map'][ele];
                            });

                            //yanjtmp
                            rawData.forEach(function(ele){
        //                      var rowstr =  "";
        //                      rowstr += ele.rowkey;

                                if(dataobj.hasOwnProperty(ele.rowkey)){
                                metricidxs.forEach(function(elee){
                                    dataobj[ele.rowkey].push(ele[elee]);
                                });
                                //                      dataobj[ele.rowkey].push();
                                }
                                else{
                                dataobj[ele.rowkey] = [];
                                metricidxs.forEach(function(elee){
                                    dataobj[ele.rowkey].push(ele[elee]);
                                });
                                }

        //                      rowstr += '\r\n';
        //                      datastr += rowstr;
                            });
                        }

                        //FIXME date maybe not align within different queryId
                        if (seriesType !== 'flags' && !!seriesData) {
                            if (metrics.length == 0) {
                                metrics.push(queryId + '.date')
                            }
                            //_.extend(data,rawData);
                            data = _.merge(rawData, data, function (a, b) {
                                var x = _.isArray(a) ? a.concat(b) : undefined;
                                x = _.uniq(x);
                                _.sortBy(x, 'date');
                                return x;
                            });
                            var reg = new RegExp(queryId + '\\.\\w+', 'g');
//                                        console.log(aggr.match(reg));
//                                        metrics.push.apply(metrics, aggr.match(reg));

                        }
                    });

//                                metrics = _.uniq(metrics);

                    for (var kdate in dataobj) {
                        if (dataobj.hasOwnProperty(kdate)) {
                        var rowrow  = "";
                        rowrow += kdate+',';
                        dataobj[kdate].forEach(function(ele){
                            rowrow += ele+',';
                        });

                        rowrow = rowrow.substring(0,(rowrow.length-1));
                        rowrow +=  '\r\n';
                        datastr += rowrow;
                        }
                    }               

                    var csvData = yanjtitle + '\r\n';
                    csvData += datastr;

                    var b = new Blob([csvData]);
                    window.saveAs(b, 'raw_data.csv');

                },
                separator: false
            }]
        }
    };
    return Option;
}




//sort array based on time(first element)
function compare(a, b) {
    if (a[0] < b[0])
        return -1;
    if (a[0] > b[0])
        return 1;
    return 0;
}


function arrayUtil() {

}

arrayUtil.prototype = {
    removeItem: function (array, value) {
        var index = array.indexOf(value);
        if (index >= 0) {
            array.splice(index, 1);
        }
        return array;
    }
}
