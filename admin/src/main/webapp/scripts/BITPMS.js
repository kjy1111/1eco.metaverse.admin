var BITPMS = {};

var pmsSetup = {
    DeviceName: 'BM7'
};

BITPMSClass.setup = function (opt) {
    $.extend(pmsSetup, opt);
};

function BITPMSClass() {
    var $this = this;
    var dataECG = [];
    var plotECG = null;
    var dataSpO2 = [];
    var plotSpO2 = null;
    var dataIBP1 = [];
    var plotIBP1 = null;
    var dataIBP2 = [];
    var plotIBP2 = null;
    var dataResp = [];
    var plotResp = null;
    var dataEtCO2 = [];
    var plotEtCO2 = null;
    var dataCount = 500;

    var min = 10000.0;  // 디버깅용
    var max = -10000.0; // 디버깅용



    function getDummyData(count) {
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push([i, 0])
        }
        return data;
    }

    this.monitor = {};

    this.drawECG = function ($selector, data) {
        var term = 60;
        if ($selector.length != 0) {
            var options = {
                series: {
                    shadowSize: 0,	// Drawing is faster without shadows
                },
                yaxis: {
                    min: -15 / parseFloat($this.monitor.EcgSize),
                    max: 30 / parseFloat($this.monitor.EcgSize),
                    show: false
                },
                xaxis: {
                    show: false
                }
            };
            if (pmsSetup.DeviceName == 'M30') {
                options.yaxis = {
                    min: 5,
                    max: 400,
                    show: false
                };
                term = 15;
            }
            var currentData = getDummyData(dataCount * 2);
            if (plotECG == null) {
                //더미 데이터로 한번 그린다.
                plotECG = $.plot($selector, [{ data: currentData, color: "green" }], options);
            }
            var arr = data.split(',');
            for (var i = 0, j = dataECG.length; i < arr.length; i++ , j++) {
                dataECG.push([j, arr[i]]);
            }

            if (dataECG.length < dataCount * 2) {
                for (var i = 0; i < dataECG.length; i++) {

                    currentData[i] = dataECG[i];
                }
                plotECG = $.plot($selector, [{ data: currentData, color: "green" }], options);

            } else {
                currentData = [];
                for (var i = 0, j = term; j < dataECG.length; i++ , j++) {
                    currentData.push([i, dataECG[j][1]]);
                }
                plotECG = $.plot($selector, [{ data: currentData, color: "green" }], options);
                dataECG = currentData;
            }
        }
    };

    this.drawSpO2 = function ($selector, data) {
        if ($selector.length != 0) {
            var options = {
                series: {
                    shadowSize: 0,	// Drawing is faster without shadows
                },
                yaxis: {
                    min: 5,
                    max: 70,
                    show: false
                },
                xaxis: {
                    show: false
                }
            };
            if (pmsSetup.DeviceName == 'M30') {
                options.yaxis = {
                    min: -10,
                    max: 250,
                    show: false
                };
            }
            var currentData = getDummyData(dataCount);
            if (plotSpO2 == null) {
                //더미 데이터로 한번 그린다.
                plotSpO2 = $.plot($selector, [currentData], options);
            }

            var arr = data.split(',');
            for (var i = 0, j = dataSpO2.length; i < arr.length; i++ , j++) {
                dataSpO2.push([j, arr[i]]);
            }

            if (dataSpO2.length < dataCount) {
                for (var i = 0; i < dataSpO2.length; i++) {
                    currentData[i] = dataSpO2[i];
                }
                plotSpO2 = $.plot($selector, [{ data: currentData, color: "blue" }], options);
            } else {
                currentData = [];
                for (var i = 0, j = 15; j < dataSpO2.length; i++ , j++) {
                    currentData.push([i, dataSpO2[j][1]]);
                }
                plotSpO2 = $.plot($selector, [{ data: currentData, color: "blue" }], options);
                dataSpO2 = currentData;
            }
            $('span[name=SpO2Graph]').css('height', currentData[0][1] + '%');
        } else {
            var currentData = getDummyData(dataCount);
            var arr = data.split(',');
            for (var i = 0, j = dataSpO2.length; i < arr.length; i++ , j++) {
                dataSpO2.push([j, arr[i]]);
            }

            if (dataSpO2.length < dataCount) {
                for (var i = 0; i < dataSpO2.length; i++) {
                    currentData[i] = dataSpO2[i];
                }
            } else {
                currentData = [];
                for (var i = 0, j = 15; j < dataSpO2.length; i++ , j++) {
                    currentData.push([i, dataSpO2[j][1]]);
                }
                dataSpO2 = currentData;
            }
            var per = currentData[0][1];
            if (per > 50) per = 50;
            $('span[name=SpO2Graph]').css('height', (per * 2) + '%');
        }
    };

    this.drawIBP1 = function ($selector, data) {
        if ($selector.length != 0) {
            var IBPmin = 0;
            var IBPmax = 30;

            if ($this.monitor.Ibp1Name == "ART" || $this.monitor.Ibp1Name == "FEM" || $this.monitor.Ibp1Name == "UAP" || $this.monitor.Ibp1Name == "Other") {
                //4356~6440
                IBPmin = 4300;
                IBPmax = 6500 * parseFloat($this.monitor.Ibp1Scale) / 30
            } else {
                //552~803
                IBPmin = 500;
                IBPmax = 830 * parseFloat($this.monitor.Ibp1Scale) / 30
            }

            var options = {
                series: {
                    shadowSize: 0,	// Drawing is faster without shadows
                },
                yaxis: {
                    min: IBPmin,
                    max: IBPmax,
                    show: false
                },
                xaxis: {
                    show: false
                }
            };
            var currentData = getDummyData(dataCount);
            if (plotIBP1 == null) {
                //더미 데이터로 한번 그린다.
                plotIBP1 = $.plot($selector, [currentData], options);
            }

            var arr = data.split(',');
            for (var i = 0, j = dataIBP1.length; i < arr.length; i++ , j++) {
                dataIBP1.push([j, arr[i]]);
            }

            if (dataIBP1.length < dataCount) {
                for (var i = 0; i < dataIBP1.length; i++) {
                    currentData[i] = dataIBP1[i];
                }
                plotIBP1 = $.plot($selector, [{ data: currentData, color: "red" }], options);
            } else {
                currentData = [];
                for (var i = 0, j = 15; j < dataIBP1.length; i++ , j++) {
                    currentData.push([i, dataIBP1[j][1]]);
                }
                plotIBP1 = $.plot($selector, [{ data: currentData, color: "red" }], options);
                dataIBP1 = currentData;
            }
        }
    };

    this.drawIBP2 = function ($selector, data) {
        if ($selector.length != 0) {
            var IBPmin = 0;
            var IBPmax = 0;

            if ($this.monitor.Ibp2Name == "ART" || $this.monitor.Ibp2Name == "FEM" || $this.monitor.Ibp2Name == "UAP" || $this.monitor.Ibp2Name == "Other") {
                //4356~6440
                IBPmin = 4300;
                IBPmax = 6500 * parseFloat($this.monitor.Ibp2Scale) / 30
            } else {
                //552~803
                IBPmin = 500;
                IBPmax = 830 * parseFloat($this.monitor.Ibp2Scale) / 30
            }
            var options = {
                series: {
                    shadowSize: 0,	// Drawing is faster without shadows
                },
                yaxis: {
                    min: IBPmin,
                    max: IBPmax,
                    show: false
                },
                xaxis: {
                    show: false
                }
            };
            var currentData = getDummyData(dataCount);
            if (plotIBP2 == null) {
                //더미 데이터로 한번 그린다.
                plotIBP2 = $.plot($selector, [currentData], options);
            }

            var arr = data.split(',');
            for (var i = 0, j = dataIBP2.length; i < arr.length; i++ , j++) {
                dataIBP2.push([j, arr[i]]);
            }

            if (dataIBP2.length < dataCount) {
                for (var i = 0; i < dataIBP2.length; i++) {
                    currentData[i] = dataIBP2[i];
                }
                plotIBP2 = $.plot($selector, [{ data: currentData, color: "blue" }], options);
            } else {
                currentData = [];
                for (var i = 0, j = 15; j < dataIBP2.length; i++ , j++) {
                    currentData.push([i, dataIBP2[j][1]]);
                    //if (min > parseFloat(dataIBP2[j][1])) {
                    //    min = parseFloat(dataIBP2[j][1]);
                    //}
                    //if (max < parseFloat(dataIBP2[j][1])) {
                    //    max = parseFloat(dataIBP2[j][1]);
                    //}
                }
                plotIBP2 = $.plot($selector, [{ data: currentData, color: "blue" }], options);
                dataIBP2 = currentData;
                //console.log(min, max);
                //console.log(data);
            }
        }
    };

    this.drawResp = function ($selector, data) {
        if ($selector.length != 0) {
            var options = {
                series: {
                    shadowSize: 0,	// Drawing is faster without shadows
                },
                yaxis: {
                    min: -5,
                    max: 5,
                    show: false
                },
                xaxis: {
                    show: false
                }
            };
            if (pmsSetup.DeviceName == 'M30') {
                options.yaxis = {
                    min: -5,
                    max: 250,
                    show: false
                };
            }
            var currentData = getDummyData(dataCount);
            if (plotResp == null) {
                //더미 데이터로 한번 그린다.
                plotResp = $.plot($selector, [currentData], options);
            }

            var arr = data.split(',');
            for (var i = 0, j = dataResp.length; i < arr.length; i++ , j++) {
                dataResp.push([j, arr[i]]);
            }

            if (dataResp.length < dataCount) {
                for (var i = 0; i < dataResp.length; i++) {
                    currentData[i] = dataResp[i];
                }
                plotResp = $.plot($selector, [{ data: currentData, color: "darkorange" }], options);
            } else {
                currentData = [];
                for (var i = 0, j = 15; j < dataResp.length; i++ , j++) {
                    currentData.push([i, dataResp[j][1]]);
                }
                plotResp = $.plot($selector, [{ data: currentData, color: "darkorange" }], options);
                dataResp = currentData;
            }
        }
    };

    this.drawEtCO2 = function ($selector, data) {
        if ($selector.length != 0) {
            var options = {
                series: {
                    shadowSize: 0,	// Drawing is faster without shadows
                },
                yaxis: {
                    min: 0,
                    max: 550 * parseFloat($this.monitor.EtCO2Scale) / 40,
                    show: false
                },
                xaxis: {
                    show: false
                }
            };
            if (pmsSetup.DeviceName == 'M30') {
                options.yaxis = {
                    min: 5,
                    max: 200,
                    show: false
                };
            }
            var currentData = getDummyData(dataCount);
            if (plotEtCO2 == null) {
                //더미 데이터로 한번 그린다.
                plotEtCO2 = $.plot($selector, [currentData], options);
            }

            var arr = data.split(',');
            for (var i = 0, j = dataEtCO2.length; i < arr.length; i++ , j++) {
                dataEtCO2.push([j, arr[i]]);
            }

            if (dataEtCO2.length < dataCount) {
                for (var i = 0; i < dataEtCO2.length; i++) {
                    currentData[i] = dataEtCO2[i];
                }
                plotEtCO2 = $.plot($selector, [{ data: currentData, color: "darkorange" }], options);
            } else {
                currentData = [];
                for (var i = 0, j = 15; j < dataEtCO2.length; i++ , j++) {
                    currentData.push([i, dataEtCO2[j][1]]);
                }
                plotEtCO2 = $.plot($selector, [{ data: currentData, color: "darkorange" }], options);
                dataEtCO2 = currentData;
            }
        }
    };

    this.bindTexture = function ($container, data) {
        var pms = JSON.parse(data).Data;
        $.each(pms, function (name, value) {
            if (name == "IBP") {
                var IBP1Value = value["IBP1Value"];
                var IBP2Value = value["IBP2Value"];

                if (IBP1Value) {
                    value["IBPValue1_1"] = IBP1Value.substr(IBP1Value.indexOf("("), IBP1Value.indexOf(")") - IBP1Value.indexOf("(") + 1);
                    value["IBPValue1"] = IBP1Value.substr(0, IBP1Value.indexOf("(")) + "/ " + IBP1Value.substr(IBP1Value.indexOf(")") + 2);
                    value["IBP1SysHighLimit"] = value["IBP1SysHighLimit"] + "S";
                    value["IBP1SysLowLimit"] = value["IBP1SysLowLimit"] + "mmHg";
                    $('#ibp1Value .rct0102').show();
                }
                if (IBP2Value) {
                    value["IBPValue2_1"] = IBP2Value.substr(IBP2Value.indexOf("("), IBP2Value.indexOf(")") - IBP2Value.indexOf("(") + 1);
                    value["IBPValue2"] = IBP2Value.substr(0, IBP2Value.indexOf("(")) + "/ " + IBP2Value.substr(IBP2Value.indexOf(")") + 2);
                    value["IBP2SysHighLimit"] = value["IBP2SysHighLimit"] + "S";
                    value["IBP2SysLowLimit"] = value["IBP2SysLowLimit"] + "mmHg";
                    $('#ibp2Value .rct0102').show();
                }
            }
            if (name == "NIBP") {
                var NIBPValue = value["SysValue"];
                if (NIBPValue) {
                    //   value["NIBPValue"] = '(' + NIBPValue.substr(NIBPValue.indexOf("(") + 1, NIBPValue.indexOf(")") - NIBPValue.indexOf("(") - 1) + ')';
                }
            }
            //if (name == 'ECG') {
            //    var ECGValue = value["ECGValue"];
            //    if (ECGValue) {
            //        value["NIBPValue"] = NIBPValue.substr(NIBPValue.indexOf("(") + 1, NIBPValue.indexOf(")") - NIBPValue.indexOf("(") - 1);
            //        value["NIBPHighValue1"] = NIBPValue.substr(0, NIBPValue.indexOf("("));
            //        value["NIBPLowValue1"] = NIBPValue.substr(NIBPValue.indexOf(")") + 2);
            //    }
            //}
            if (name == 'Temp') {
                value["FirstTempHighLimit"] = $.customFormat.number(parseFloat(value["FirstTempHighLimit"]), '#.0');
                value["FirstTempLowLimit"] = $.customFormat.number(parseFloat(value["FirstTempLowLimit"]), '#.0');
                value["SecondTempHighLimit"] = $.customFormat.number(parseFloat(value["SecondTempHighLimit"]), '#.0');
                value["SecondTempLowLimit"] = $.customFormat.number(parseFloat(value["SecondTempLowLimit"]), '#.0');
                value["Temp1Value"] = $.customFormat.number(parseFloat(value["Temp1Value"]), '#.0');
                value["Temp2Value"] = $.customFormat.number(parseFloat(value["Temp2Value"]), '#.0');
                if (value["TempUnit"] == 'C') {
                    value["TempUnit"] = '℃';
                } else {
                    value["TempUnit"] = '℉';
                }
            }
            if (name == 'EtCO2') {
            }
            if (name == 'Resp') {
            }
            if (name == 'HR') {
            }
            if (name == 'SpO2') {
            }

            value["CurrentTime"] = $.customFormat.date(new Date(), 'HH:mm');
            var $item = $container.find('[name=' + name + ']');
            BIT.bindObjectData(value, {
                $parent: $item
            });
        });
        $.extend($this.monitor, pms);

        //console.log(pms);
        //var $item = $container.find('[name=' + name + ']');
        BIT.bindObjectData($this.monitor, {
            $parent: $container
        });
    };

    this.bindMonitorMessage = function ($container, data) {
        var monitorData = JSON.parse(data).Data;
        if (monitorData["Ibp1Scale"]) {
            monitorData["Ibp1Scale"] = monitorData["Ibp1Scale"].substr(1);
        }
        if (monitorData["Ibp2Scale"]) {
            monitorData["Ibp2Scale"] = monitorData["Ibp2Scale"].substr(1);
        }
        if (monitorData["TempUnit"]) {
            if (monitorData["TempUnit"] == 'C') {
                monitorData["TempUnit"] = '℃';
            } else {
                monitorData["TempUnit"] = '℉';
            }
        }
        if (monitorData["NibpInterval1"]) monitorData["NibpInterval1"] = changeInterval(monitorData["NibpInterval"]);
        if (monitorData["NibpInterval2"]) monitorData["NibpInterval2"] = changeInterval2(monitorData["NibpInterval"]);
        if (monitorData["RespSize"]) monitorData["RespSize"] = monitorData["RespSize"].substr(1);
        if (monitorData["EtCO2Scale"]) monitorData["EtCO2Scale"] = monitorData["EtCO2Scale"].substr(1);
        if (monitorData["EcgSize"]) monitorData["EcgSize"] = parseFloat(monitorData["EcgSize"].substr(1)) * 0.1;

        $.extend($this.monitor, monitorData);
        //console.log(name);
        //console.log(monitorData);
        BIT.bindObjectData($this.monitor, {
            $parent: $container
        });
    }

    function changeInterval(value) {
        if (value != '') {
            switch (value.substr(0, 1)) {
                case 'M': {     //Minute
                    return value.substr(1) + 'MIN';
                }
                case 'H': {
                    return value.substr(1) + 'HR';
                }
                default: {
                    return 'OFF';
                }
            }
        }
        return value;
    }

    function changeInterval2(value) {
        if (value != '') {
            switch (value.substr(0, 1)) {
                case 'M':
                case 'H': {
                    return $.customFormat.number(parseInt(value.substr(1)), '00') + ':00';
                }
                default: {
                    return '00:00';
                }
            }
        }
        return value;
    }

    this.bindAlarmMessage = function ($container, data) {
        var alarm = JSON.parse(data).Data;
        BIT.bindObjectData(alarm, {
            $parent: $container
        });
    };
}

this.BITPMS = new BITPMSClass();