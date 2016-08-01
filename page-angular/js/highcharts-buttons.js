;
(function(Highcharts) {
    var UNDEFINED,
        ALIGN_FACTOR,
        H = Highcharts,
        Chart = H.Chart,
        extend = H.extend,
        each = H.each;

    // Initialize on chart load
    var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod|CriOS)/g) ? true : false );

    Chart.prototype.callbacks.push(function(chart) {

        if(chart.options.report == null){
            return;
        }

        var buttonBar = chart.options.moreOptions ? chart.options.moreOptions.buttonBar : null;
        var buttons = buttonBar ? buttonBar.buttons : null;

        if(buttons == null){
            buttons = chart.options.report.buttons;
        }

        if(buttons == null){
            return;
        }


        var container = $(chart.renderTo);

        var titleContainer = container.find('.highcharts-title');
        var titlePos = titleContainer.position();
        if(titlePos == null){
            return;
        }
        var bbox = titleContainer[0].getBBox();

        var top = parseInt(bbox.y);
        var left = parseInt(bbox.x-5);
        var width = parseInt(bbox.width+10);
        var height = parseInt(bbox.height+5);

        container.addClass('hc-has-buttons');
        var right = 5;
        $.each(buttons,function(){
            if(!iOS){
                //TODO, hardcode for selling chart9
                if(chart.options.report.title == 'Photo Uploader' && chart.options.report.app == 'selling3' && this.text =='Deep Dive'){
                    return;
                }

                var btnDiv = $('<div class="charticon"></div>');
                btnDiv.html(this.icon);

                if(angular.isObject(this.position)){//TODO need enhance
                    btnDiv.css('right' ,(this.position.right || '5')+'px');
                    btnDiv.css('top' ,(this.position.top || '10')+'px');
                    btnDiv.css('visibility','visible');
                }else if(this.position === 'title right'){
                    btnDiv.css('left' ,((left + width) || '5')+'px');
                    btnDiv.css('top' ,(top)+'px');
                    btnDiv.css('visibility','visible');
                }else{
                    btnDiv.css('right' ,right+'px');
                    right += 25;
                }
                if(this.visiblity == "hidden"){
                    btnDiv.css('visibility','hidden');
                    container.hover(function(){
                        btnDiv.css('visibility','visible');
                    }, function(){
                        btnDiv.css('visibility','hidden');
                    })
                }

                var onclick = this.onclick;
                btnDiv.qtip({
                    content: {
                        text: this.text
                    },
                    position: {
                        target: false,
                        my: 'top left',  // Position my top left...
                        at: 'bottom center' // at the bottom right of...
                    },
                    style: {
                        classes: 'qtip-bootstrap'

                    }
                });
                btnDiv.click(function(){
                    onclick.apply(chart);
                });
                container.append(btnDiv);
            }else{
                if(this.defaultInIOS){
                    var onclick = this.onclick;

                    $(container).click(function(){
                        onclick.apply(chart);
                    });
                }
            }
        });

    });


}(Highcharts));