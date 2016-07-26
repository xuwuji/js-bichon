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
