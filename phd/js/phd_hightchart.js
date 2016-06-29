 var series1 = {
     name: '',
     text: null,
     marker: {
         enabled: false
     },
     data: [
            [0, 4],
            [1, 9],
            [2, 2]
        ],
     legend: {
         enabled: false
     },
 };

 var series2 = {
     name: '',
     text: null,
     marker: {
         enabled: false
     },
     data: [
            [0, 14],
            [1, 19],
            [2, 12]
        ],
     legend: {
         enabled: false
     },
     dashStyle: 'dash',
     color: '#7cb5ec'
 };

 var options = {
     chart: {
         renderTo: 'chart_2',
         //defaultSeriesType: 'spline'
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
         text: '%HP Visitors Who Search',
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

             var ss = [];
             var ret = '<div style="min-width: 150px;white-space:normal; ">' + '%HP Visitors Who Search' + '</div>';
             $.each(this.points, function (idx, p) {
                 var x = {
                     y: p.y,
                     color: p.series.color,
                     name: p.series.name,
                     key: p.key
                 };

                 ss.push(x);
             });
             $.each(ss, function (idx, p) {
                 //console.log(pa.valtype);

                 var y = null;
                 switch ('percentage') {
                     case 'float':
                         y = Highcharts.numberFormat(p.y, 2);
                         break;
                     case 'percentage':
                         y = Highcharts.numberFormat(p.y * 100, 2) + '%';
                         break;
                     default:
                         y = p.y;
                 }
                 ret += '<span style="color:' + p.color + '">' + p.key + '</span>: <b>' + y + '</b><br/>';
             });
             return ret;
         }
     }
 }
 options.series.push(series1);
 new Highcharts.Chart(options);
 options.series.push(series2);
 new Highcharts.Chart(options);


 $('#chart_2').append('<div class="deepdivebtn" style=" position: absolute; top:3px;right:3px; width: 24px; height: 24px; font-size: 16px; cursor: pointer; color: #ccc;"><i class="fa fa-plus-square-o" style="margin-left: 10px;"></i></div>');
