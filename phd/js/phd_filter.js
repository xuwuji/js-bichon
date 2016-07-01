 $(document).ready(function () {
         var filter = new Filter();
         //filter.applyBtn();
     }

 );

 function Filter() {
     this.init();
 }


 Filter.prototype = {
     init: function () {
         this.initFilterData();
         this.initDateRange();

     },

     //init filter data from config
     initFilterData: function () {
         var temp = this;
         $.getJSON('http://localhost:8080/OLAPService/config/filter/124', function (data) {
             var siteData = data.site;
             var deviceData = data.device;
             var experienceData = data.exprience;
             $.each(siteData, function (i, val) {
                 //console.log(val);
                 $('#site_selector').append('<option>' + val + '</option>');
             });
             $.each(deviceData, function (i, val) {
                 //console.log(val);
                 $('#device_selector').append('<option>' + val + '</option>');
             });
             $.each(experienceData, function (i, val) {
                 //console.log(val);
                 $('#experience_selector').append('<option>' + val + '</option>');
             });

         }).done(function () {
             $('.selectpicker').selectpicker('refresh');
             $('.multi-select').selectpicker('selectAll');
         });
     },

     // init the date range picker
     initDateRange: function () {

         function cb(start, end) {
             //alert('dd');
             $('#filterDateRange').html(start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
         }

         //cb(moment().subtract(29, 'days'), moment());

         $('#filterDateRange').daterangepicker({
             "startDate": moment(moment().subtract(29, 'days')),
             "endDate": moment(),
             ranges: {
                 'Today': [moment(), moment()],
                 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                 'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                 'This Month': [moment().startOf('month'), moment().endOf('month')],
                 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
             },
             "applyClass": "btn-primary"
         }, cb(moment().subtract(29, 'days'), moment()));
     },

 }

 var query = {
     "source": "Mysql",
     "queryType": "groupBy",
     "dataSource": {
         "table": "src488",
         "family": "fake"
     },
     "granularity": "day",
     "dimensions": ["0"],
     "filter": {
         "type": "and",
         "fields": []
     },
     "aggregations": [{
         "type": "doubleSum",
         "name": "2",
         "fieldName": "2"
    }, {
         "type": "doubleSum",
         "name": "3",
         "fieldName": "3"
    }, {
         "type": "doubleSum",
         "name": "4",
         "fieldName": "4"
    }, {
         "type": "doubleSum",
         "name": "5",
         "fieldName": "5"
    }, {
         "type": "doubleSum",
         "name": "6",
         "fieldName": "6"
    }, {
         "type": "doubleSum",
         "name": "7",
         "fieldName": "7"
    }, {
         "type": "doubleSum",
         "name": "8",
         "fieldName": "8"
    }, {
         "type": "doubleSum",
         "name": "9",
         "fieldName": "9"
    }, {
         "type": "doubleSum",
         "name": "10",
         "fieldName": "10"
    }, {
         "type": "doubleSum",
         "name": "11",
         "fieldName": "11"
    }, {
         "type": "doubleSum",
         "name": "12",
         "fieldName": "12"
    }, {
         "type": "doubleSum",
         "name": "13",
         "fieldName": "13"
    }, {
         "type": "doubleSum",
         "name": "14",
         "fieldName": "14"
    }, {
         "type": "doubleSum",
         "name": "15",
         "fieldName": "15"
    }, {
         "type": "doubleSum",
         "name": "16",
         "fieldName": "16"
    }]
 };


 //get selected config data for filter
 var getSelected = function () {
     var site = $('#site_selector').val();
     var device = $('#device_selector').val();
     var experience = $('#experience_selector').val();
     var date = $('#filterDateRange').val().split('-');
     date[0] = moment(date[0]).format("YYYY-MM-DD");
     date[1] = moment(date[1]).format("YYYY-MM-DD");
     dateO = {};
     dateO.type = "daterange";
     dateO.dimension = 0;
     dateO.value = date;
     siteO = {};
     console.log(site);
     console.log(device);
     console.log(experience);
     console.log(dateO);
     var queryData = query;
     queryData["filter"]["fields"]=[];
     queryData["filter"]["fields"].push(dateO);
     console.log(queryData);
 };

 $('#compared2_selector').on('change', function () {
     var l2 = $(this).val();
     console.log(l2);
     if (l2 !== 'None') {
         console.log(l2);
         $('#compared3_selector').attr('disabled', false).selectpicker('refresh');
     }

     if (l2 === 'None') {
         $('#compared3_selector').attr('disabled', true).selectpicker('refresh');
     }
 });
