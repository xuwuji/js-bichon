//qtip for deep dive and show sql button 
$(document).ready(
    function () {
        $('.deepdivebtn').qtip({
            content: {
                text: '<div style="font-size:15px;text-aligen:center;height:50px;line-height:30px;width:50px">deep dive</div>'
            },
            position: {
                at: 'center'
            },
            style: {
                classes: 'qtip-bootstrap'
            }
        });

        $('.sqlbtn').qtip({
            content: {
                text: '<div style="font-size:15px;text-aligen:center;height:50px;line-height:30px;">show sql</div>'
            },
            position: {
                at: 'bottom center'
            },
            style: {
                classes: 'qtip-bootstrap'
            }
        });
    }

);
