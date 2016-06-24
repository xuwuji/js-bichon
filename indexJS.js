 //相当于windows.onload=function(){};  但是需要等待网页全部加载完成，包括图片，才会执行。就算调用了多次，也只会执行最近的一次
 //只需要等待网页中的dom元素全部加载完就可以执行，多次调用，每次都会被执行
 $(document).ready(function () {
     $('#id').click(function () {
         $(this).css('color', 'green');
     });
 });

 //上面的可以简写成如下：
 $(function () {
     $('#id').click(function () {
         $(this).css('color', 'green');
     });
 });


 var changeClass1Color = function () {
     $('.class1').click(function () {
         $(this).css('color', 'green');
     });
 }


 $(function () {
     changeClass1Color();
     //alert($('div').length);
     //alert($('div').size());
     //alert($('*').size());
     for (var v = 0; v < $('*').size(); v++) {
         console.log($('*')[v].nodeName);
     }
 });

 //jquery有容错功能，没有找到指定的id，也不会报错
