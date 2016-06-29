 $(document).ready(function () {
         var filter = new Filter();
         filter.fillData();
     }

 );

 function Filter() {
     this.init();
 }


 Filter.prototype = {
     init: function () {
         //$('#site_selector').append('<option>Relish</option>');
         this.fillData();
     },
     //get config data for filter
     getConfig: function () {

     },
     //filter data for config
     fillData: function () {
         $.getJSON('http://localhost:8080/OLAPService/config/filter/124', function (data) {
             //console.log(data);
             var site = data.site;
             var device = data.device;
             var exprience = data.exprience;
             $.each(site, function (i, val) {
                 console.log(val);
                 $('#site_selector').append('<option>' + val + '</option>');
             });
             $.each(device, function (i, val) {
                 console.log(val);
                 $('#device_selector').append('<option>' + val + '</option>');
             });
             $.each(exprience, function (i, val) {
                 console.log(val);
                 $('#experience_selector').append('<option>' + val + '</option>');
             });

         }).done(function () {
             $('.selectpicker').selectpicker('refresh');
             $('.multi-select').selectpicker('selectAll');
         });
     }
 }
