

var COM = {};
/** 
 *  @description CommonClass
 */
function CommonClass() {
    var $this = this;

    this.messages = {};
    this.defaultPageInitializerCaller = [];


    //#region callMultiFunction - 한페이지에 같은 아이템이 여러개 존재 할 경우 그 전부를 실행하게 함.
    this.callMultiFunction = function ($selector, targetSelectorString, functionName, param1, param2, param3, param4) {
        var deferred = Q.defer();
        if ($selector.length > 0) {
            var clientIds = [];
            for (var i = 0; i < $selector.length; i++) {
                var clientId = $selector[i].id.split('_')[1];
                var contains = false;
                for (var j = 0; j < clientIds.length; j++) {
                    if (clientIds[j] === clientId) {
                        contains = true;
                        break;
                    }
                }
                if (!contains) {
                    clientIds.push(clientId);
                }
            }
            var promises = [];
            for (var k = 0; i < clientIds.length; k++) {
                if (window[targetSelectorString + clientIds[k]] !== null) {
                    promises.push(window[targetSelectorString + clientIds[k]][functionName](param1, param2, param3, param4));
                }
            }
            return Q.all(promises);
        }
        deferred.resolve();
        return deferred.promise;
    };
    //#endregion

    //#region uploadSingleFile
    /**
     * @description 하나의 파일을 업로드 합니다.
     * @param {any} $selector input file의 selector
     * @param {any} formData 함께 전송할 formData
     * @param {any} acceptFileType 허용되는 파일 형식
     * @param {Number} fileSize 허용되는 파일의 크기(byte)
     * @param {any} callback callback
     */
    this.uploadSingleFile = function ($selector, formData, acceptFileType, fileSize, callback) {
        BIT.uploadSingleFile($selector, '/Services/File/UploadFiles.aspx?ModelType=Models.Physical.FileInfoModel', formData, acceptFileType, fileSize, callback);
    };
    //#endregion

    // url, data, successCallback, failCallback
    // url, successCallback, failCallback
    this.download = function (url, arg1, arg2, arg3) {
      //  $this.showLoading();
        let data = null;
        var successCallback = null;
        var failCallback = null;
        if (typeof arg1 === 'object') {
            data = arg1;
            successCallback = arg2;
            failCallback = arg3;
        } else {
            successCallback = arg1;
            failCallback = arg2;
        }
        $.cookie('fileDownload', 'true');
        $.fileDownload(url, {
            httpMethod: 'POST',
            data: data,
            successCallback: function (url) {
            //    $this.hideLoading();
                if (!BIT.isNullOrEmpty(successCallback)) {
                    successCallback(url);
                }
            },
            failCallback: function (html, url) {
             //   $this.hideLoading();
                if (!BIT.isNullOrEmpty(failCallback)) {
                    failCallback(html, url);
                }
            }
        });
    };
    
  //#region addEventHandler
    this.addEventHandler = function () {
        $('.uint').css('ime-mode', 'disabled');
        $('.int').css('ime-mode', 'disabled');
        $('.engnum').css('ime-mode', 'disabled');
        $('.float').css('ime-mode', 'disabled');
        $('.input-datepicker').css('ime-mode', 'disabled');


        $('.ellipsis').each(function () {
            let $this = $(this);
            if ($this.is('td')) {
                if ($this.find('div.ellipsis').length === 0) {
                    let $child = $('<div class="ellipsis_td"><em></em></div>');
                    $child.find('em').append($this[0].innerHTML);
                    $this.empty().append($child);
                }
            } else if ($this.is('span')) {

            } else {
                alert('관리자에게 문의');
            }
        });

        $('body').on('mouseover', 'span[name=WorkerName]', function (event) {
            if (!$(this).data('workerpid')) {
                $(this).css('cursor', 'text');
            } else {
                $(this).css('cursor', 'pointer');
            }
        });
        $('body').on('keydown', '.input-datepicker', function (event) {
            if (event.shiftKey || event.ctrlKey || event.altKey) {
                event.preventDefault();
            }
            // 숫자, -, BS, Left, Right, Del, Tab
            if (event.keyCode && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)
                && event.keyCode !== 189 && event.keyCode !== 109
                && event.keyCode !== 8
                && event.keyCode !== 37
                && event.keyCode !== 39
                && event.keyCode !== 46
                && event.keyCode !== 9) {
                event.preventDefault();
            }
        });

        if ($(".scrollbar").length > 0) {
            $(".scrollbar").each(function () {
                if ($(this).getNiceScroll().length === 0) {
                    if ($(this).is('.horizrailenabled')) {
                        $(this).niceScroll({
                            cursorcolor: "#b4b4b4",
                            enableobserver: false
                        });
                    } else {
                        $(this).niceScroll({
                            cursorcolor: "#b4b4b4",
                            enableobserver: false,
                            horizrailenabled: false
                        });
                    }
                } else {
                    $(this).getNiceScroll().resize();
                }
            });
        }
        
        if ($.fn.datepicker) {
            $('.input-datepicker').datepicker({
                language: cultureCode,
                autoHide: true,
                zIndex: 9999999
            });
        }

        $('.button-datepicker').click(function (e) {
            e.preventDefault();
            $(this).prev().focus();
            return false;
        });

    };
    //#endregion
}

this.COM = new CommonClass();

BIT.setup({
    errorViewType: 'tooltip',  // 'tooltip' 혹은 'alert'
    useClientEncrypt: false,  //클라이언트 암호화를 사용 할 것인가?
    useServerEncrypt: false,
    tooltipTimer: 3000,
    mode: 'Debug'
});



$(function () {
	
	COM.addEventHandler();

    // 뒤로가기 방지 스크립트
    if (location.href.toLocaleLowerCase().indexOf('/errors/') < 0
        && location.href.toLocaleLowerCase().indexOf('/downloadfile.aspx') < 0) {
        history.pushState(null, document.title, location.href);
        window.addEventListener('popstate', function (event) {
            history.pushState(null, document.title, location.href);
        });
    }
});

