let ws = null;
let userClose = false;

let protocolSetup = {
    SystemName: 'WebClient',
    IpAddress: '127.0.0.1'
};

ProtocolWrapper.setup = function (opt) {
    $.extend(protocolSetup, opt);
};

ProtocolWrapper.createInstance = function (msg) {
    let obj = new ProtocolWrapper();
    if (!BIT.isNull(obj)) {
        obj.setProtocolMessage(msg);
        if (BIT.isNull(obj.protocol)) {
            return null;
        }
    }
    return obj;
};

function ProtocolWrapper(callbackReceived) {
    "use strict";
    let $this = this;
    let $thisMessage = null;
    let socketServerUrl = "ws://" + protocolSetup.IpAddress + ":12345/gateway";
    let failCount = 0;
    let protocolHeaderLength = 74;
    let shackedHand = false;
    let savedProtocol = null;

    this.protocolHeader = {};
    this.protocol = {};

    this.setProtocolMessage = function (msg) {
        $thisMessage = msg;
        $this.protocolHeader = new ProtocolHeader($thisMessage);
        $this.protocol = new Protocol($this.protocolHeader.ProtocolName);
    };

    function Protocol(protocolName) {
        if (typeof ($this[protocolName]) === 'undefined') {
            return null;
        }
        let protocol = new $this[protocolName]($thisMessage.substring(protocolHeaderLength));
        return protocol;
    }

    this.toString = function () {
        return $this.protocolHeader.toString() + $this.protocol.toString();
    };

    function getParent(win) {
        if (win.location === win.parent.location) {
            return win;
        } else {
            return getParent(win.parent);
        }
    }

    function createHeader(protocol) {
        let header = new ProtocolHeader();
        header.SystemName = protocolSetup.SystemName;
        header.IpAddress = protocolSetup.IpAddress;
        header.ProtocolName = protocol.getName();
        header.ProtocolDataType = '0';
        header.DateTime = $.customFormat.date(new Date(), 'yyyyMMddHHmmssSSS00');
        header.Length = protocol.toString().length + protocolHeaderLength;
        return header;
    }

    function open(protocol) {
        console.log('try connect......');
        shackedHand = false;
        userClose = false;
        try {
            ws = new WebSocket(socketServerUrl);
        } catch (e) {
            BIT.modal('웹소켓을 지원하지 않는 브라우저입니다.', BIT.messages.common_info_title);
            return;
        }
        ws.onmessage = callback;

        ws.onopen = function () {
            console.log('connected......');
            if (!BIT.isNull(protocol)) {
                if (protocol.getName() !== 'CSHWM') {
                    savedProtocol = protocol;
                    setTimeout(function () {
                        var hwm = new $this.CSHWM();
                        $this.send(hwm);
                    }, 500);
                } else {
                    savedProtocol = null;
                    setTimeout(function () {
                        $this.send(protocol);
                    }, 500);
                }
            }
        };
        ws.onclose = function () {
            console.log('can not connect..'); //사용자에게 보여줌
            if (!userClose) {
                if (!BIT.isNull(callbackReceived)) {
                    let wrapper = new ProtocolWrapper();
                    let p = new wrapper.SWERROR();
                    p.ErrorType = 'CanNotConnectToGateway';
                    p.ErrorMessage = BIT.messages.gateway_cannotconect;
                    wrapper.protocol = p;
                    wrapper.protocolHeader = createHeader(p);
                    callbackReceived(wrapper);
                }
                close();
            }
        };
    }

    function callback(e) {
        if (BIT.isNull(ProtocolWrapper)) {
            return;
        }

        let wrapper = ProtocolWrapper.createInstance(e.data);
        if (BIT.isNull(wrapper)) {
            return;
        }
        switch (wrapper.protocolHeader.ProtocolName) {
            case 'SPECG':
            case 'SPIBP1':
            case 'SPIBP2':
            case 'SPSPO2':
            case 'SPRESP':
            case 'SPETCO2':
            case 'SPTXT':
            case 'SPALARM': {
                break;
            }
            default: {
                if ($.isEmptyObject(wrapper.protocol)) {
                    console.log('Received : ' + wrapper.protocolHeader.toString() + ' ... ');
                } else {
                    console.log('Received : ' + wrapper.toString());
                }
                break;
            }
        }

        let protocol = wrapper.protocol;
        switch (wrapper.protocolHeader.ProtocolName) {
            case 'SSACK': {
                failCount = 0;
                console.log("ACK : " + protocol.Message);
                break;
            }
            case 'SSCSINFO': {
                if (!shackedHand) {
                    console.log("......HandShack Completed......");
                    shackedHand = true;
                }
                if (savedProtocol) {
                    $this.send(savedProtocol);
                    savedProtocol = null;
                }
                break;
            }
            case 'SWRESULT': {
                failCount = 0;
                console.log('RESULT : ' + protocol.Message);
                BIT.callFunction('');
                break;
            }
            case 'SRNOTFOUND': {
                BIT.modal('송신자가 존재하지 않습니다.', '오류');
                break;
            }
            case 'SWERROR': {
                if (wrapper.protocol.ErrorType === 'Fail') {
                    failCount++;
                }
                if (failCount >= 5) {
                    ws.close(1000);
                }
                console.log('Error : ' + protocol.ErrorType + '\rMessage : ' + protocol.ErrorMessage);
                break;
            }

            //#region ECG
            case 'SPECG': {
                BITPMS.drawECG($('#divECG'), protocol.Message);
                break;
            }
            case 'SPIBP1': {
                BITPMS.drawIBP1($('#divIBP1'), protocol.Message);
                break;
            }
            case 'SPIBP2': {
                BITPMS.drawIBP2($('#divIBP2'), protocol.Message);
                break;
            }
            case 'SPSPO2': {
                BITPMS.drawSpO2($('#divSpO2'), protocol.Message);
                break;
            }
            case 'SPRESP': {
                BITPMS.drawResp($('#divResp'), protocol.Message);
                break;
            }
            case 'SPETCO2': {
                BITPMS.drawEtCO2($('#divEtCO2'), protocol.Message);
                break;
            }
            case 'SPTXT': {
                BITPMS.bindTexture($('#divTexture'), protocol.Message);
                break;
            }
            case 'SPALARM': {
                BITPMS.bindAlarmMessage($('#divAlarmMessage'), protocol.Message);
                break;
            }
            case 'SPMON': {
                BITPMS.bindMonitorMessage($('#divTexture'), protocol.Message);
                break;
            }
            //#endregion

            case 'SWMWFEND': {
                //BIT.modal('WAVE 파일 전송 완료...');
                //$("iframe").contents().find("#RecordDoneYn").val("Y");
                BIT.callFunction("recordDone");
                break;
            }
            case 'SWMRUN': {
                BIT.modal('마이크 장치가 사용중입니다.', '경고');
                break;
            }
            case 'CROUTWEB': {
                BIT.modal('원격서버에 접속할 수 없습니다.<br> 네트워크 상태를 확인하십시오.', '오류', function () {
                    getParent(window).location.href = '/';
                });
                break;
            }
            case 'CWMSTOP': {
                BIT.callFunction("stopRecord");
                break;
            }
        }
        if (!BIT.isNull(callbackReceived)) {
            callbackReceived(wrapper);
        }
    }

    this.disconnected = function () {
        return BIT.isNull(ws) || ws.readyState !== 1;
    };

    this.send = function (protocol) {
        let obj = new ProtocolWrapper();
        obj.protocol = protocol;
        obj.protocolHeader = createHeader(protocol);

        if (BIT.isNull(ws)) {
            setTimeout(function () {
                open(protocol);
            }, 1000);

        } else if (ws.readyState !== 1) {
            console.log('readyState : ' + ws.readyState);
            setTimeout(function () {
                open(protocol);
            }, 1000);
        } else {
            ws.send(obj.toString());
            console.log('Web Send : ' + obj.toString());
        }
    };

    function close() {
        userClose = true;
        if (ws.readyState === 1) {
            ws.close();
            console.log('Web Socket : close');
        }
    }

    function ProtocolHeader(msg) {
        this.SystemName = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 16));
        this.IpAddress = BIT.isNull(msg) ? '' : $.trim(msg.substring(16, 31));
        this.ProtocolName = BIT.isNull(msg) ? '' : $.trim(msg.substring(31, 41));
        this.ProtocolDataType = BIT.isNull(msg) ? '' : $.trim(msg.substring(41, 42));
        this.DateTime = BIT.isNull(msg) ? '' : $.trim(msg.substring(42, 61));
        this.Length = BIT.isNull(msg) ? '' : $.trim(msg.substring(61, 74));

        this.toString = function () {
            return this.SystemName.padRight(16) + this.IpAddress.padRight(15) + this.ProtocolName.padRight(10) + this.ProtocolDataType + this.DateTime.padRight(19) + ' ' + this.Length.toString().padRight(12);
        };
    }

    function ClientSystem(msg) {
        this.SystemName = BIT.isNull(msg) ? '' : $.trim(msg.substr(0, 16));
        this.IpAddress = BIT.isNull(msg) ? '' : $.trim(msg.substr(16, 16));
        this.UserName = BIT.isNull(msg) ? '' : $.trim(msg.substr(16 + 15, 32));
        this.OrgName = BIT.isNull(msg) ? '' : $.trim(msg.substr(16 + 15 + 32, 64));
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg.substr(16 + 15 + 32 + 64, 128));

        this.toString = function () {
            return this.SystemName.padLeft(16) + this.IpAddress.padLeft(15) + this.UserName.padLeft(32) + this.OrgName.padLeft(64) + this.RoomName.padLeft(128);
        };
    }

    //#region ------------------------  프로토콜 목록  ------------------------------------------------
    //Protocol
    //CWSTD
    //환자ID(10)오더ID(10)환자명(20)테스트카데고리(2)장비종류(2)
    this.CWSTD = function (msg) {
        this.PatientPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.OrderPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(10, 20));
        this.PatientName = BIT.isNull(msg) ? '' : $.trim(msg.substring(20, 40));
        this.TestCategory = BIT.isNull(msg) ? '' : $.trim(msg.substring(40, 42));
        this.DeviceType = BIT.isNull(msg) ? '' : $.trim(msg.substring(42, 44));
        this.OtherMessage = BIT.isNull(msg) ? '' : $.trim(msg.substring(46));
        this.getName = function () {
            return "CWSTD";
        };
        this.toString = function () {
            if (!BIT.isNull(this.PatientName) && this.PatientName.length > 20) {
                this.PatientName = this.PatientName.substring(0, 20);
            }
            return this.PatientPid.padLeft(10) + this.OrderPid.padLeft(10) + this.PatientName.padLeft(20) + this.TestCategory.padLeft(2) + this.DeviceType.padLeft(2) + this.OtherMessage;
        };
    };

    this.CWCONTODEV = function (msg) {
        this.TestCategory = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 2));
        this.DeviceType = BIT.isNull(msg) ? '' : $.trim(msg.substring(2, 4));
        this.getName = function () {
            return "CWCONTODEV";
        };
        this.toString = function () {
            return this.TestCategory.padLeft(2) + this.DeviceType.padLeft(2);
        };
    };

    this.SWCONTODEV = function (msg) {
        this.DeviceName = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return "SWCONTODEV";
        };
        this.toString = function () {
            return this.DeviceName;
        };
    };

    this.CWFVPUT = function (msg) {
        this.Pid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.TotalCount = BIT.isNull(msg) ? '' : Number($.trim(msg.substring(10, 14)));
        this.Template = BIT.isNull(msg) ? '' : $.trim(msg.substring(14));
        this.getName = function () {
            return 'CWFVPUT';
        };
        this.toString = function () {
            return this.Pid.padLeft(10) + this.TotalCount.toString().padLeft(4) + this.Template;
        };
    };
    this.CCOPEN = function (msg) {
        this.DeviceName = msg;
        this.getName = function () {
            return 'CCOPEN';
        };
        this.toString = function () {
            return this.DeviceName;
        };
    };

    this.CWCUSMSG = function (msg) {
        this.PatientPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.OrderPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(10, 20));
        this.PatientName = BIT.isNull(msg) ? '' : $.trim(msg.substring(20, 40));
        this.TestCategory = BIT.isNull(msg) ? '' : $.trim(msg.substring(40, 42));
        this.DeviceType = BIT.isNull(msg) ? '' : $.trim(msg.substring(42, 44));
        this.ActionMessage = BIT.isNull(msg) ? '' : $.trim(msg.substring(44, 60));
        this.Data = BIT.isNull(msg) ? '' : $.trim(msg.substring(60));
        this.getName = function () {
            return "CWCUSMSG";
        };
        this.toString = function () {
            if (!BIT.isNull(this.PatientName) && this.PatientName.length > 20) {
                this.PatientName = this.PatientName.substring(0, 20);
            }
            return this.PatientPid.padLeft(10) + this.OrderPid.padLeft(10) + this.PatientName.padLeft(20) + this.TestCategory.padLeft(2) + this.DeviceType.padLeft(2) + this.ActionMessage.padLeft(16) + this.Data;
        };
    };

    this.CWNEWPER = function (msg) {
        this.PatientPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.PatientName = BIT.isNull(msg) ? '' : $.trim(msg.substring(10, 30));
        this.ReceiptPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(30, 40));
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg.substring(40, 168));
        this.getName = function () {
            return "CWNEWPER";
        };
        this.toString = function () {
            if (!BIT.isNull(this.PatientName) && this.PatientName.length > 20) {
                this.PatientName = this.PatientName.substring(0, 20);
            }
            return this.PatientPid.padLeft(10) + this.PatientName.padLeft(20) + this.ReceiptPid.padLeft(10) + this.RoomName.padLeft(128);
        };
    };

    this.CWVIDEO = function (msg) {
        this.PatientPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.PatientName = BIT.isNull(msg) ? '' : $.trim(msg.substring(10, 30));
        this.ReceiptPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(30, 40));
        this.getName = function () {
            return "CWVIDEO";
        };
        this.toString = function () {
            if (!BIT.isNull(this.PatientName) && this.PatientName.length > 20) {
                this.PatientName = this.PatientName.substring(0, 20);
            }
            return this.PatientPid.padLeft(10) + this.PatientName.padLeft(20) + this.ReceiptPid.padLeft(10);
        };
    };

    this.CSHWM = function (msg) {
        this.getName = function () {
            return 'CSHWM';
        };
        this.toString = function () {
            return '';
        };
    };

    this.SSHWM = function (msg) {
        this.getName = function () {
            return 'SSHWM';
        };
        this.toString = function () {
            return '';
        };
    };

    this.CSSETNAME = function (msg) {
        this.SystemName = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'CSSETNAME';
        };
        this.toString = function () {
            return this.SystemName;
        };
    };

    this.SSACK = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SSACK';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.CRINVITE = function (msg) {
        this.TargetSystemName = BIT.isNull(msg) ? '' : $.trim(msg.substr(0, 16));
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg.substr(16));
        this.getName = function () {
            return 'CRINVITE';
        };
        this.toString = function () {
            return this.TargetSystemName.padLeft(16) + this.RoomName;
        };
    };

    this.SRINVITE = function (msg) {
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg.substr(0, 128));
        this.ClientSystem = BIT.isNull(msg) ? '' : new ClientSystem(msg.substr(128));
        this.getName = function () {
            return 'SRINVITE';
        };
        this.toString = function () {
            return this.RoomName.padLeft(128) + this.ClientSystem.toString();
        };
    };

    this.CIASSCLIST = function (msg) {
        this.getName = function () {
            return 'CIASSCLIST';
        };
        this.toString = function () {
            return '';
        };
    };

    this.SSACLIST = function (msg) {
        this.ClientSystemNames = [];
        {
            let count = msg.length / 16;
            for (let i = 0; i < count; i++) {
                this.ClientSystemNames.push($.trim(msg.substring(16 * i, 16 + 16 * i)));
            }
        }

        this.getName = function () {
            return 'SSACLIST';
        };
        this.toString = function () {
            let message = '';
            for (let i = 0; i < this.ClientSystemNames.length; i++) {
                message += this.ClientSystemNames[i].padLeft(16);
            }
            return message;
        };
    };

    this.CIROOM = function (msg) {
        this.getName = function () {
            return "CIROOM";
        };
        this.toString = function () {
            return '';
        };
    };

    this.SRINFO = function (msg) {
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg.substr(0, 128));
        this.OwnerSystemName = BIT.isNull(msg) ? '' : $.trim(msg.substr(128, 16));
        this.OwnerIpAddress = BIT.isNull(msg) ? '' : $.trim(msg.substr(144, 15));

        this.JoinedSystemList = [];
        {
            let length = 16 + 15 + 32 + 64 + 128;
            let count = (msg.length - 159) / length;
            for (let i = 0; i < count; i++) {
                this.JoinedSystemList.push(new ClientSystem(msg.substr(159 + i * length)));
            }
        }

        this.getName = function () {
            return 'SRINFO';
        };
        this.toString = function () {
            let message = '';
            for (let i = 0; i < this.JoinedSystemList.length; i++) {
                message += this.JoinedSystemList[i].SystemName.padLeft(16) + this.JoinedSystemList[i].IpAddress.padLeft(15) + (BIT.isNull(this.JoinedSystemList[i].UserName) ? "".padLeft(32) : this.JoinedSystemList[i].UserName.padLeft(32)) + (BIT.isNull(this.JoinedSystemList[i].OrgName) ? "".padLeft(64) : this.JoinedSystemList[i].OrgName.padLeft(128));
            }
            return message;
        };
    };

    this.CICS = function (msg) {
        this.getName = function () {
            return "CICS";
        };
        this.toString = function () {
            return '';
        };
    };

    this.SSCSINFO = function (msg) {
        this.ClientSystem = BIT.isNull(msg) ? '' : new ClientSystem(msg);
        this.getName = function () {
            return 'SSCSINFO';
        };
        this.toString = function () {
            return this.ClientSystem.toString();
        };
    };

    this.SWRESULT = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.PatientInfo = null;
        if (!BIT.isNull(msg)) {
            let index = msg.indexOf('|!@#|');
            if (index >= 0) {
                let patientInfoString = msg.substring(index + 5);
                this.PatientInfo = patientInfoString.replace(/,/gi, '&').queryStringToJSON();
            }
        }
        this.getName = function () {
            return 'SWRESULT';
        };

        return this.Message;
    };

    this.SRNOTFOUND = function (msg) {
        this.getName = function () {
            return 'SRNOTFOUND';
        };
        this.toString = function () {
            return '';
        };
    };

    this.SWAUTH = function (msg) {
        this.IsAuthenticated = BIT.isNull(msg) ? '' : $.trim(msg.substring(1, 8));
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg.substring(8));
        this.getName = function () {
            return 'SWAUTH';
        };
        this.toString = function () {
            return this.IsAuthenticated.padLeft(8) + this.Message;
        };
    };

    this.SWERROR = function (msg) {
        this.ErrorType = BIT.isNull(msg) ? '' : $.trim(msg.substring(1, 100));
        this.ErrorMessage = BIT.isNull(msg) ? '' : $.trim(msg.substring(100));
        this.getName = function () {
            return 'SWERROR';
        };
        this.toString = function () {
            return this.ErrorType.padLeft(100) + this.ErrorMessage;
        };
    };

    this.SPECG = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPECG';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.SPIBP1 = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPIBP1';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.SPIBP2 = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPIBP2';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.SPSPO2 = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPSPO2';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.SPRESP = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPRESP';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.SPETCO2 = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPETCO2';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.SPTXT = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPTXT';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.SPALARM = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPALARM';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.CRCHGNAME = function (msg) {
        this.AfterRoomName = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 128));
        this.BeforeRoomName = BIT.isNull(msg) ? '' : $.trim(msg.substring(128, 256));

        this.getName = function () {
            return 'CRCHGNAME';
        };
        this.toString = function () {
            return this.AfterRoomName.padLeft(128) + this.BeforeRoomName.padLeft(128);
        };
    };

    this.CRJOIN = function (msg) {
        this.MakerSystemName = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 16));
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg.substring(16, 144));

        this.getName = function () {
            return 'CRJOIN';
        };
        this.toString = function () {
            if (BIT.isNull(this.MakerSystemName)) {
                this.MakerSystemName = '';
            }
            if (BIT.isNull(this.RoomName)) {
                this.RoomName = '';
            }
            return this.MakerSystemName.padLeft(16) + this.RoomName.padLeft(128);
        };
    };

    this.CRMAKE = function (msg) {
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'CRMAKE';
        };
        this.toString = function () {
            return this.RoomName;
        };
    };

    this.CRMAKEJOIN = function (msg) {
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'CRMAKEJOIN';
        };
        this.toString = function () {
            return this.RoomName;
        };
    };

    this.CRMJ2 = function (msg) {
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'CRMJ2';
        };
        this.toString = function () {
            return this.RoomName;
        };
    };

    this.SREXISTS = function (msg) {
        this.RoomName = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SREXISTS';
        };
        this.toString = function () {
            return this.RoomName;
        };
    };

    this.CCINFO = function (msg) {
        this.UserName = BIT.isNull(msg) ? '' : $.trim(msg.substr(0, 32));
        this.OrgName = BIT.isNull(msg) ? '' : $.trim(msg.substr(32, 64));
        this.getName = function () {
            return 'CCINFO';
        };
        this.toString = function () {
            return this.UserName.padLeft(32) + this.OrgName.padLeft(64);
        };
    };

    this.SPMON = function (msg) {
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);
        this.getName = function () {
            return 'SPMON';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    this.CWCAPTURE = function (msg) {
        this.PatientPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.PatientName = BIT.isNull(msg) ? '' : $.trim(msg.substring(10, 30));
        this.CaptureCategory = BIT.isNull(msg) ? '' : $.trim(msg.substring(40, 50));

        this.getName = function () {
            return 'CWCAPTURE';
        };
        this.toString = function () {
            if (!BIT.isNull(this.PatientName) && this.PatientName.length > 20) {
                this.PatientName = this.PatientName.substring(0, 20);
            }
            return this.PatientPid.padLeft(10) + this.PatientName.padLeft(20) + this.CaptureCategory.padLeft(10);
        };
    };

    this.CWMPLAY = function (msg) {
        this.PatientPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.PatientName = BIT.isNull(msg) ? '' : $.trim(msg.substring(10, 30));

        this.getName = function () {
            return 'CWMPLAY';
        };
        this.toString = function () {
            if (!BIT.isNull(this.PatientName) && this.PatientName.length > 20) {
                this.PatientName = this.PatientName.substring(0, 20);
            }
            return this.PatientPid.padLeft(10) + this.PatientName.padLeft(20);
        };
    };

    this.SWMPLAYING = function (msg) {

        this.getName = function () {
            return 'SWMPLAYING';
        };
        this.toString = function () {
            return '';
        };
    };

    this.CWMSNDSTOP = function (msg) {

        this.getName = function () {
            return 'CWMSNDSTOP';
        };
        this.toString = function () {
            return '';
        };
    };

    this.CWMRCVSTOP = function (msg) {

        this.getName = function () {
            return 'CWMRCVSTOP';
        };
        this.toString = function () {
            return '';
        };
    };

    this.CWMWF = function (msg) {
        this.PatientPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 10));
        this.PatientName = BIT.isNull(msg) ? '' : $.trim(msg.substring(10, 30));
        this.OrderPid = BIT.isNull(msg) ? '' : $.trim(msg.substring(30, 40));

        this.getName = function () {
            return 'CWMWF';
        };
        this.toString = function () {
            if (!BIT.isNull(this.PatientName) && this.PatientName.length > 20) {
                this.PatientName = this.PatientName.substring(0, 20);
            }
            return this.PatientPid.padLeft(10) + this.PatientName.padLeft(20) + this.OrderPid.padLeft(10);
        };
    };

    this.CWMSTOP = function (msg) {

        this.getName = function () {
            return 'CWMSTOP';
        };
        this.toString = function () {
            return '';
        };
    };

    this.SWMSNDSTOP = function (msg) {

        this.getName = function () {
            return 'SWMSNDSTOP';
        };
        this.toString = function () {
            return '';
        };
    };

    this.SWMPROG = function (msg) {
        this.Counter = BIT.isNull(msg) ? '' : $.trim(msg);

        this.getName = function () {
            return 'SWMPROG';
        };
        this.toString = function () {
            return this.Counter;
        };
    };

    this.CROUT = function (msg) {

        this.getName = function () {
            return 'CROUT';
        };
        this.toString = function () {
            return '';
        };
    };

    this.SROUT = function (msg) {

        this.OwnerYN = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 1));
        this.TargetSystemName = BIT.isNull(msg) ? '' : $.trim(msg.substring(1));

        this.getName = function () {
            return 'SROUT';
        };
        this.toString = function () {
            return this.OwnerYN + this.TargetSystemName;
        };
    };

    this.CROUTWEB = function (msg) {

        this.getName = function () {
            return 'CROUTWEB';
        };
        this.toString = function () {
            return '';
        };
    };

    this.CSNAMEREQ = function (msg) {

        this.SystemName = BIT.isNull(msg) ? '' : $.trim(msg);

        this.getName = function () {
            return 'CSNAMEREQ';
        };
        this.toString = function () {
            return this.SystemName;
        };
    };

    this.SSNAMEREP = function (msg) {

        this.SystemName = BIT.isNull(msg) ? '' : $.trim(msg);

        this.getName = function () {
            return 'SSNAMEREP';
        };
        this.toString = function () {
            return this.SystemName;
        };
    };

    this.SEXISTSSN = function (msg) {
        this.IpAddress = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 15));
        this.SystemName = BIT.isNull(msg) ? '' : $.trim(msg.substring(15, 31));

        this.getName = function () {
            return 'SEXISTSSN';
        };
        this.toString = function () {
            return this.IpAddress.padLeft(15) + this.SystemName.padLeft(16);
        };
    };

    this.CCDCOLD = function (msg) {
        this.SystemName = BIT.isNull(msg) ? '' : $.trim(msg);

        this.getName = function () {
            return 'CCDCOLD';
        };
        this.toString = function () {
            return this.SystemName;
        };
    };

    this.CCDCNEW = function (msg) {

        this.getName = function () {
            return 'CCDCNEW';
        };
        this.toString = function () {
            return '';
        };
    };

    this.CWCONCLOSE = function (msg) {

        this.DeviceName = BIT.isNull(msg) ? '' : $.trim(msg);

        this.getName = function () {
            return 'CWCONCLOSE';
        };
        this.toString = function () {
            return this.DeviceName;
        };
    };

    this.CCCONECT = function (msg) {
        this.getName = function () {
            return 'CCCONECT';
        };
        this.toString = function () {
            return '';
        };
    };

    //중복 연결로 인해 현재 계정을 로그아웃 할것.
    this.SSLOGOUT = function (msg) {

        this.getName = function () {
            return 'SSLOGOUT';
        };
        this.toString = function () {
            return '';
        };
    };

    //등록에 대한 결과 피드백
    this.SWREG = function (msg) {

        this.IsSucceed = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 8));
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg.substring(8));

        this.getName = function () {
            return 'SWREG';
        };
        this.toString = function () {
            return this.IsSucceed.padLeft(8) + this.Message;
        };
    };

    //초기화 완료
    this.SWINITCOMP = function (msg) {

        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);

        this.getName = function () {
            return 'SWINITCOMP';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    //지정맥 사용장 정보 삭제
    this.SWUSERDEL = function (msg) {

        this.IsSucceed = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 8));
        this.Message = BIT.isNull(msg) ? '' : $.trim(msg.substring(8));

        this.getName = function () {
            return 'SWUSERDEL';
        };
        this.toString = function () {
            return this.IsSucceed.padLeft(8) + this.Message;
        };
    };


    //환경 설정값 조회 요청
    this.CWGWCONFIG = function (msg) {

        this.SectionName = BIT.isNull(msg) ? '' : $.trim(msg.substring(0, 16));
        this.DeviceName = BIT.isNull(msg) ? '' : $.trim(msg.substring(16));

        this.getName = function () {
            return 'CWGWCONFIG';
        };
        this.toString = function () {
            return this.SectionName.padLeft(16) + this.DeviceName;
        };
    };

    //환경 설정값 조회 응답
    this.SWGWCONFIG = function (msg) {

        this.Message = BIT.isNull(msg) ? '' : $.trim(msg);

        this.getName = function () {
            return 'SWGWCONFIG';
        };
        this.toString = function () {
            return this.Message;
        };
    };

    //#endregion ------------------------  프로토콜 목록  ------------------------------------------------
}

function websocketClose() {
    userClose = true;
    if (ws.readyState === 1) {
        ws.close();
        console.log('Web Socket : close');
    }
}