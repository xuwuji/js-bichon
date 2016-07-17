//show sql desc for a chart

function showSQL(chart_id, page_id) {
    $.getJSON('http://localhost:8080/OLAPService/config/chart?page_id=' + page_id + '&chart_id=' + chart_id, function (data) {
        $('.sql-modal-title').html(data.chart_title);
        $('.sql-modal-body').html(data.chart_sql_desc);
    });
}
