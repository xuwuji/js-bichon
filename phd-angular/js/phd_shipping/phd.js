 //normal option for each chart
 function getOption() {
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
                     ret += '<span style="color:' + point.color + '">' + moment(point.xValue).format("YYYY-MM-DD") + '</span>: <b>' + point.yValue + '</b><br/>';
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
