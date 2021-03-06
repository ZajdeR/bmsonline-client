/* global registersToChart */

var registersToChart = [];
$(document).ready(function () {
    $('#detailContainer').highcharts();
    setDialogButtons();
    var dtpStart = '\'' + $('input#dtpStart').val() + '\'';
    var dtpEnd = '\'' + $('input#dtpEnd').val() + '\'';

});

//ustawienie zakresu danych
function setDialogButtons() {
    $("div#detailContainer").hide();
    var now = new Date();
    var yesterday = new Date();
    var dchart = $('#detailContainer').highcharts();
    var controls = $("div#controls");
    yesterday.setHours(now.getHours() - 3);
    //$.datetimepicker.setLocale('pl');
    $("input#dtpStart").datetimepicker({
        lang: 'pl',
        format: 'Y-m-d H:i',
        mask: true,
        value: yesterday
    });
    $("input#dtpEnd").datetimepicker({
        lang: 'pl',
        format: 'Y-m-d H:i',
        mask: true,
        value: now
    });
    //obsługa przycisku ustawienia zakresu na ostatnią godzinę
    $("#setHour").click(function () {
        var now = new Date();
        var ago = new Date();
        ago.setHours(now.getHours() - 1);
        $("input#dtpStart").datetimepicker({value: ago});
        $("input#dtpEnd").datetimepicker({value: now});

    });
    //obsługa przycisku ustawienia zakresu na ostatni dzień
    $("#setDay").click(function () {
        var now = new Date();
        var ago = new Date();
        ago.setDate(now.getDate() - 1);
        $("input#dtpStart").datetimepicker({value: ago});
        $("input#dtpEnd").datetimepicker({value: now});
    });
    //obsługa przycisku ustawienia zakresu na ostatni weekend
    $("#setWeek").click(function () {
        var now = new Date();
        var ago = new Date();
        ago.setDate(now.getDate() - 7);
        $("input#dtpStart").datetimepicker({value: ago});
        $("input#dtpEnd").datetimepicker({value: now});
    });
    //obsługa przycisku ustawienia zakresu na ostatni miesiąc
    $("#setMonth").click(function () {
        var now = new Date();
        var ago = new Date();
        ago.setMonth(now.getMonth() - 1);
        $("input#dtpStart").datetimepicker({value: ago});
        $("input#dtpEnd").datetimepicker({value: now});
    });
    //obsługa przycisku ustawienia zakresu na ostatni rok
    $("#setYear").click(function () {
        var now = new Date();
        var ago = new Date();
        ago.setFullYear(now.getFullYear() - 1);
        $("input#dtpStart").datetimepicker({value: ago});
        $("input#dtpEnd").datetimepicker({value: now});
    });
    //obsługa przycisku ustawienia zakresu na cały zakres
    $("#setAll").click(function () {
        var now = new Date();
        var ago = new Date(0);
        $("input#dtpStart").datetimepicker({value: ago});
        $("input#dtpEnd").datetimepicker({value: now});
    });
    //zmiana zakresu
    $("#changeScope").click(function () {
        while (dchart.series.length > 0)
            dchart.series[0].remove(true);

        dchart.colorCounter = 0;
        dchart.symbolCounter = 0;

        var dtpStart = '\'' + $('input#dtpStart').val() + '\'';
        var dtpEnd = '\'' + $('input#dtpEnd').val() + '\'';
        $.each(registersToChart, function (key, value) {
            loadData(value[0], dtpStart, dtpEnd, value[1]);
        });

    });
    //dodanie dowolnej linii
    $("#addCustomLine").click(function () {
        var yAxis = $('input[name=axType]:checked').val();
        var value = parseFloat($('input#customValue').val());
        var color = $('input#customColor').val();
        addCustomLine(value, yAxis, color);
    });

    //przycisk dodania serii
    $("#addSeries").click(function () {
        controls.show();
        $("div#detailContainer").show();
        var regId = $("select#avRegs").val();
        var dtpStart = '\'' + $('input#dtpStart').val() + '\'';
        var dtpEnd = '\'' + $('input#dtpEnd').val() + '\'';
        var yAxis = $('input[name=axType]:checked').val();
        registersToChart.push([regId, parseInt(yAxis)]);

        loadData(regId, dtpStart, dtpEnd, parseInt(yAxis));
    });
}
//załadowanie danych
function loadData(registerId, dtpStart, dtpEnd, yAxis) {
    var data = {
        registerId: registerId,
        from: dtpStart,
        to: dtpEnd,
        yAxis: yAxis
    };
    $(".main-row").append("<i class='fa fa-spinner fa-pulse fa-4x'></i><div id='loading' class='row text-center'><div class='col-md-12'></br></br></br>Ładowanie...</div></div>").show();
    return $.ajax({
        type: "POST",
        datatype: "application/json",
        data: data,
        async: false,
        url: Routing.generate('bms_data_analyze_add_series'),
        success: function (ret) {
            $(".main-row").children(".fa-spinner, div#loading").remove();
            var series = {
                id: ret['id'],
                data: ret['data'],
                name: ret['name'] + " <i id='" + ret['id'] + "' class='fa fa-remove fa-lg' style='display: none; color: #B00'></i>",
                yAxis: yAxis,
                type: "spline",
                lineWidth: 1
            };

            setSeries(series);
        }
    });

    function setSeries(series) {

        var chart = $('#detailContainer').highcharts();
        chart.addSeries(series);
        var max = new Date(chart.xAxis[0].max);
        var min = new Date(chart.xAxis[0].min);
        chart.setTitle({text: "Zakres: " + $.formatDateTime("dd-mm-yy", min) + " -" + $.formatDateTime("dd-mm-yy", max)});

        setClickable();
        $("select#avRegs").val(null);
        $("." + parseInt(series.id)).hide();
    }
}

function addCustomLine(value, yAxis, color) {

    var dchart = $('#detailContainer').highcharts();

    var series = {
        data: [[dchart.xAxis[0].min, value], [dchart.xAxis[0].max, value]],
        yAxis: parseInt(yAxis),
        type: "spline",
        lineWidth: 1,
        lineColor: color,
        name: "Linia dodatkowa " + value
    };

    dchart.addSeries(series);
}


function setClickable() {
    var legendItem = $(".highcharts-legend-item");

    legendItem.find("i").each(function () {
        $(this).unbind("click").click(function () {
            var dchart = $('#detailContainer').highcharts();
            var id = parseInt($(this).attr("id"));

            dchart.get(id).remove();
            registersToChart.splice($.inArray([id, 1], registersToChart), 1);
            setClickable();
            $("." + id).show();
        });
    });
    legendItem.hover(function () {
        $(this).find("i").show();

    }, function () {
        $(this).find("i").hide();
    });
}

