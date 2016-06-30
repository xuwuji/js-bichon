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
             $('#filterDateRange span').html(start.format('MMMM D, YYYY') + ' to ' + end.format('MMMM D, YYYY'));
         }

         cb(moment().subtract(29, 'days'), moment());

         $('#filterDateRange').daterangepicker({
             ranges: {
                 'Today': [moment(), moment()],
                 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                 'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                 'This Month': [moment().startOf('month'), moment().endOf('month')],
                 'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
             },
             "applyClass": "btn-primary"
         }, cb);
     },

 }


 //get selected config data for filter
 var getSelected = function () {
     var site = $('#site_selector').val();
     var device = $('#device_selector').val();
     var experience = $('#experience_selector').val();
     console.log(site);
     console.log(device);
     console.log(experience);
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
