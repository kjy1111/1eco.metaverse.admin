/*
 의존성..
messages-ko.js
 */
var BIT = {};

//#region Extend 함수
(function ($) {
    "use strict";
    $.extend({
        // queryString을 키값쌍인 hash로 변환합니다.
        getUrlVars: function () {
            let vars = {}, hash;
            if (window.location.href.indexOf('=') < 0) {
                return vars;
            }
            let queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
            if (BIT.setup().useClientEncrypt) {
                let key = CryptoJS.enc.Utf8.parse(aesValue.key);
                let iv = CryptoJS.enc.Utf8.parse(aesValue.iv);
                if (queryString.toLowerCase().indexOf('encryptedrequest=') >= 0) {
                    queryString = CryptoJS.AES.decrypt(queryString.slice(queryString.indexOf('=') + 1), key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
                }
            }
            let hashes = queryString.split('&');
            for (let i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                if (BIT.isNullOrEmpty(hash[0])) {
                    continue;
                }
                hash[0] = $.trim(hash[0]);
                vars[hash[0]] = decodeURIComponent(hash[1]);
            }
            return vars;
        },

        // queryString에서 키값으로 값을 찾습니다.
        getUrlVar: function (name) {
            let obj = $.getUrlVars();
            let v = null;
            $.each(obj, function (key, value) {
                if ($.trim(name.toLowerCase()) === $.trim(key.toLowerCase())) {
                    v = value;
                }
            });
            return v;
        }
    });

    $.extend($.fn, {

        multiDownload: function () {
            this.each(function (index, item) {
                setTimeout(function () {
                    item.click();
                }, 100);
            });
        },

        //#region convertQueryString - object를 queryString으로 변환합니다.
        // { name :'christina' } => name=christina
        convertQueryString: function () {
            let queryString = '';
            $.each($(this)[0], function (name, value) {
                // queryString += name + "=" + $.trim(escape(value)) + "&";
                // SpringMVC 에서 escape 를 하게 되면 한글 data 에 대해서 Controller 에서 받지
                // 못한다.
                queryString += name + "=" + $.trim(encodeURIComponent(value)) + "&";
            });
            return queryString.substring(queryString - 1);
        },
        //#endregion

        //#region clear - 선택된 selector 내부의 element들을 조회 하여 초기화 합니다.
        // $('form').clear();
        // 매개변수 includeHidden이 true 이면 hidden도 초기화 한다.
        clear: function (includeHidden) {
            var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
            $(this).find('input:not(:disabled):not([name=ModelType]),textarea,select').each(function () {

                var t = this.type, tag = this.tagName.toLowerCase();
                if (re.test(t) || tag === 'textarea') {
                    this.value = '';
                    if (!BIT.isNull($(this).data('default'))) {
                        $(this).val($(this).data('default'));
                    }
                }
                else if (t === 'checkbox' || t === 'radio') {
                    if (!BIT.isNull($(this).data('default'))) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                }
                else if (tag === 'select') {
                    this.selectedIndex = 0;

                    if (!BIT.isNull($(this).data('default'))) {
                        $(this).val($(this).data('default'));
                    }
                }
                else if (t === "file") {
                    if (BIT.browser.ie) {
                        $(this).replaceWith($(this).clone(true));
                    } else {
                        $(this).val('');
                    }
                }
                else if (includeHidden) {
                    if (includeHidden === true && /hidden/.test(t) || typeof includeHidden === 'string' && $(this).is(includeHidden)) {
                        this.value = '';
                        if (!BIT.isNull($(this).data('default'))) {
                            $(this).val($(this).data('default'));
                        }
                    }
                }
                $(this).trigger('change');
            });
            $(this).find('span[name]').each(function () {
                $(this).text('');
                if (!BIT.isNull($(this).data('default'))) {
                    $(this).text($(this).data('default'));
                }
            });
        },
        //#endregion


        //#region getObject -  주어진 요소의 내부의 element들의 값들을 object로 만들어서 반환한다.
        getObject: function () {
            var obj = {};
            $(this).find('input:not(:disabled),textarea,select,span').each(function () {
                var ele = this;
                var tag = this.tagName.toLowerCase();
                var name = $(ele).attr('name');
                if (name !== '' && !BIT.isNull(name)) {
                    if (tag === 'span') {
                        obj[name] = $(this).html();
                    } else {
                        if (ele.type === "radio") {
                            if (ele.checked) {
                                obj[name] = $(this).val();
                            }
                        } else if (ele.type === 'checkbox') {
                            if (ele.value === 'Y') {
                                if (ele.checked) {
                                    obj[name] = 'Y';
                                } else {
                                    obj[name] = 'N';
                                }
                            } else {
                                obj[name] = $(this).val();
                            }
                        } else {
                            obj[name] = $(this).val();
                        }
                    }
                }
            });
            return obj;
        },
        //#endregion


        //#region changeObjectValue - MVVM 흉내내기
        changeObjectValue: function (obj, callback) {
            /*
            아래 처럼 사용함 MVVM 흉내내기
            $("#CustomerClerkListTbody tr").each(function () {
                var $tr = $(this);
                $tr.changeObjectValue($tr.data('customerclerkrowdata'), function (obj) {
                    customerModel = obj
                    $tr.data('customerclerkrowdata', customerModel);
                });
            });
            */
            if (BIT.isNull(obj)) {
                obj = {};
            }
            $(this).find('input:not(:disabled),textarea,select').each(function () {
                var ele = this;
                if (ele.name !== '') {
                    $(ele).unbind('change').change(function () {
                        obj[ele.name] = $(this).val();
                        if (!BIT.isNull(callback)) {
                            callback(obj);
                        }
                    });
                }
            });
        }
        //#endregion

    });
}(jQuery));

//#endregion

/**
 * @constructor
 * */
function BitCommonClass() {
    "use strict";
    let $this = this;

    let defaultSetup = {
        mode: 'Release',            // Release or Debug
        errorViewType: 'tooltip',  // 'tooltip' 혹은 'alert'
        modalType: 'layer',          // 'layer' 혹은  'alert'
        tooltipTimer: 2000,
        useClientEncrypt: false,  //클라이언트 에서 서버로 보낼때 암호화를 사용 할 것인가?
        defaultTooltipPosition: 'right',
        useServerEncrypt: false     // 서버에서 클라이언트로 받을때 암호화를 사용 할 것인가?
    };

    /** @description 매개변수의 object가 null 인지 체크 합니다.
     * @param {object} obj 매개변수 object 형식
     * @returns {boolean} null 여부
     */
    this.isNull = function (obj) {
        return typeof obj === 'undefined' || obj === null || obj === 'undefined';
    };

    /** @description 매개변수의 object가 null  혹은 빈값 인지 체크 합니다.
     * @param {object} obj 매개변수 object 형식
     * @returns {boolean} null 혹은 빈값 여부
     */
    this.isNullOrEmpty = function (obj) {
        return typeof obj === 'undefined' || obj === null || obj === 'undefined' || obj === '';
    };

    this.messages = messages_locale;

    //#region callback
    function CallbackListenerList() {
        let arr = [];

        this.push = function (delegate, key) {
            delegate.name = key;

            if (!$this.isNull(delegate.name)) {
                let isExists = false;
                for (let i = 0; i < arr.length; i++) {
                    if (delegate.name === arr[i].name) {
                        isExists = true;
                        arr.splice(i, 1, delegate);
                    }
                }
                if (!isExists) {
                    arr.push(delegate);
                }
            } else {
                arr.push(delegate);
            }
        };
        this.get = function (index) {
            return arr[index];
        };
        this.length = function () {
            return arr.length;
        };
    }

    this.callbackListenerList = new CallbackListenerList();

    /*
     * 페이지에서 script 개체를 등록 하고 어떤 액션 이후에 콜백을 받도록 설정한다.
     *  사용법
     * 페이지에서
     * var demo = (function () {
     *     var callback = function (key, value) {
     *          switch (key) {
     *             case 'keyname' :
     *              //do something...
     *              break;
     *          }
     *      }
     *      return {
     *          callback : function (key, value) {
     *              return callback(key, value);
     *          }
     *      }
     *  }
     *  //demo 개체를 등록한다.
     *  //popup의 경우 반드시 두번째 매개변수값을 입력한다. 중복등록 방지..
     *  BIT.callbackListenerList.push(demo,'demo');
     *
     *  // some action 에서....
     *  BIT.globalCallback('keyname',{});
     */
    this.globalCallback = function (key, obj) {
        var promises = [];
        for (var i = 0; i < $this.callbackListenerList.length(); i++) {
            if (!$this.isNull($this.callbackListenerList.get(i).callback)) {
                var promise = $this.callbackListenerList.get(i).callback(key, obj);
                if (!$this.isNull(promise)) {
                    promises.push(promise);
                }
            }
        }
        if (promises.length === 0) {
            return $this.dummyDeferred();
        } else {
            return Q.all(promises);
        }
    };
    //#endregion

    this.browser = (function () {
        let obj = {
            ie: false,
            edge: false,
            chrome: false,
            firefox: false,
            safari: false,
            opera: false
        };
        if ((window.opr && opr.addons) || window.opera || (navigator.userAgent.indexOf(' OPR/') >= 0))
            obj.opera = true;
        if (typeof InstallTrigger !== 'undefined')
            obj.firefox = true;
        if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)
            obj.safari = true;
        if ((/*@cc_on!@*/false) || (document.documentMode))
            obj.ie = true;
        if (!(document.documentMode) && window.StyleMedia)
            obj.edge = true;
        if (window.chrome && window.chrome.app)
            obj.chrome = true;

        return obj;
    })();

    //#region Internal Function

    function showValidatorTooltip($element, message, direction) {
        let $el = null;
        if ($element.length > 1) {
            $element.each(function () {
                if ($(this).is(':not(:hidden)')) {
                    $el = $(this);
                }
            });
            if ($el === null) {
                $el = $element.eq(0);
            }
        } else {
            $el = $element;
        }
        let offset = BIT.getOffset($el[0]);
        if ($el.is(':hidden')) {
            BIT.modal($el.attr('name') + ' 요소는 hidden 상태이므로 툴팁을 표현할 수 없습니다.<br/>문제를 해결 하십시오', '경고');
            return null;
        }
        let $tooltip = {};
        if (direction === 'top') {
            $tooltip = $('<div class="validator_t_wrap"><div class="validator_tooltips"><div class="validator_tt_ttbl"><table class="validator_tt_tbl" style="border-collapse:collapse;border:none"><tr><td class="validator_tt_tl"></td><td colspan="2" class="validator_tt_ct"></td><td class="validator_tt_tr"></td></tr><tr><td class="validator_tt_ml"></td><td class="validator_tt_mc"><!-- 내용 --><div class="validator_tt_cnt">' + message + '</div></td><td class="validator_tt_mc"><!-- 닫기 버튼 --><div class="validator_tt_btn"><span class="validator_btn_ttclose"><span>close</span></span></div></td><td class="validator_tt_mr"></td></tr><tr><td class="validator_tt_bl"></td><td colspan="2" class="validator_tt_cb"></td><td class="validator_tt_br"></td></tr></table></div><div class="validator_tt_btm"></div></div></div>');
            $tooltip.css('left', offset.left + 10);
            $tooltip.css('top', offset.top - 40 + 5);
            $(document.body).append($tooltip);
        } else {
            $tooltip = $('<div class="validator_t_wrap"><div class="validator_tooltips_b"><div class="validator_tt_top"></div><div class="validator_tt_btbl"><table class="validator_tt_tbl" style="border-collapse:collapse;border:none"><tr><td class="validator_tt_tl"></td><td colspan="2" class="validator_tt_ct"></td><td class="validator_tt_tr"></td></tr><tr><td class="validator_tt_ml"></td><td class="validator_tt_mc"><!-- 내용 --><div class="validator_tt_cnt">' + message + '</div></td><td class="validator_tt_mc"><!-- 닫기 버튼 --><div class="validator_tt_btn"><span class="validator_btn_ttclose"><span>close</span></span></div></td><td class="validator_tt_mr"></td></tr><tr><td class="validator_tt_bl"></td><td colspan="2" class="validator_tt_cb"></td><td class="validator_tt_br"></td></tr></table></div></div></div>');
            $tooltip.css('left', offset.left + 10);
            $tooltip.css('top', offset.top + $el.height() - 5);
            $(document.body).append($tooltip);
        }
        $tooltip.data('element', $el);
        $el.data('validator-tooltip', $tooltip);
        $('.validator_btn_ttclose', $tooltip).on('click', function () {
            $tooltip.remove();
        });
        let timer = setTimeout(function () {
            clearTimeout(timer);
            $tooltip.remove();
        }, defaultSetup.tooltipTimer);
        if ($el.closest('.modalContainer').length > 0) {
            $tooltip.data('containerId', $el.closest('.modalContainer').attr('id'));
        }
        return $tooltip;
    }

    function getParent(win) {
        if (win.location === win.parent.location) {
            return win;
        } else {
            return getParent(win.parent);
        }
    }

    function decryptedResponseData(data) {
        if ($this.isNull(data) || data === '') {
            return data;
        }
        if (defaultSetup.useServerEncrypt) {
            if (!$this.isNull(window["CryptoJS"]) && !$this.isNull(aesValue)) {
                var key = CryptoJS.enc.Utf8.parse(aesValue.key);
                var iv = CryptoJS.enc.Utf8.parse(aesValue.iv);
                var decrypted = CryptoJS.AES.decrypt(data, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
                return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            } else {
                return data;
            }
        } else {
            return data;
        }
    }

    function preProccessSubmit(response, $form) {
        let hasError = false;
        if (typeof response === 'string') {
            try {
                response = JSON.parse(response);
            } catch (e) {
                hasError = true;
                if (defaultSetup.mode === 'Release') {
                    $this.modal($this.messages.common_server_error, $this.messages.common_error_title);
                } else {
                    $this.modalDialog({
                        content: $(xhr.response).find('font')[0].outerHTML,
                        title: $this.messages.common_error_title,
                        width: 1000,
                        height: 500
                    });
                }
            }
        }
        //decrypt...
        if (typeof response.Data === 'string') {
            response.Data = decryptedResponseData(response.Data);
        }

        if (typeof response.IsSucceed === 'string') {
            if (response.IsSucceed.toLowerCase() === 'true') {
                response.IsSucceed = true;
            } else {
                response.IsSucceed = false;
            }
        }
        if ($this.isNull(response.Title) || response.Title === '') {
            if (response.IsSucceed) {
                response.Title = $this.messages.common_info_title;
            } else {
                response.Title = $this.messages.common_error_title;
            }
        } else if (response.Title === 'Xsrf-Error') {
            location.href = location.href;
            return;
        } else if (response.Title === 'Validator-Error') {
            // validator 오류
            let errorList = response.Data;
            if (!$this.isNull(errorList) && errorList.length > 0) {
                if (defaultSetup.errorViewType === 'tooltip') {
                    for (let i = 0; i < errorList.length; i++) {
                        try {
                            let $element = null;
                            if (!$this.isNull($form)) {
                                $element = $form.find('[name="' + errorList[i].ElementName + '"]');
                            } else {
                                $element = $('[name="' + errorList[i].ElementName + '"]');
                            }
                            if ($element.length === 0) {
                                $this.modal($this.getMessage($this.messages.common_validator_notfound_element, errorList[i].ElementName), $this.messages.common_error_title);
                            } else if ($element.length === 1) {
                                if ($element.is($(':hidden'))) {
                                    $this.modal($this.getMessage($this.messages.common_validator_hidden_element, errorList[i].ElementName), $this.messages.common_error_title);
                                } else {
                                    showValidatorTooltip($element, errorList[i].Message, $element.data('validator-direction'));
                                }
                            } else if ($element.is($(':checkbox')) || $element.is($(':radio'))) {
                                showValidatorTooltip($element.eq(0), errorList[i].Message, $element.data('validator-direction'));
                            } else {
                                alert('해당 컨테이너에 ' + errorList[i].ElementName + '가 ' + $element.length + '개 있습니다. \n소스코드를 수정하십시오.');
                            }
                        } catch (e) {
                            alert(e);
                        }
                    }
                } else if (defaultSetup.errorViewType === 'alert') {
                    $this.modal(errorList[0].Message, $this.messages.common_error_title, function () {
                        let $element;
                        if (!$this.isNull($form)) {
                            $element = $form.find('[name="' + errorList[0].ElementName + '"]');
                        } else {
                            $element = $('[name="' + errorList[0].ElementName + '"]');
                        }
                        $element.focus();
                    });
                } else {
                    $this.modal('알수 없는 errorViewType 입니다.', $this.messages.common_error_title);
                }
            }
            hasError = true;
        }
        if (!hasError) {
            if (response.Notification) {
                $this.callFunction('showNotification', response.Notification);
            }
            if (response.RedirectUrl && response.Message) {
                $this.modal(response.Message, response.Title, function () {
                    getParent(window).location.href = response.RedirectUrl;
                });
            } else if (response.Message) {
                $this.modal(response.Message, response.Title);
            } else if (response.RedirectUrl) {
                getParent(window).location.href = response.RedirectUrl;
            } else {
                if (!$this.isNull(response.Data)) {
                    var str = JSON.stringify(response.Data);
                    response.Data = JSON.parse(str.replace(/\\n/g, "\\n").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, "\\&").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f"));
                }
            }
        }
    }

    function triggerCloseModal($container) {
        $('.validator_t_wrap').each(function (index) {
            if ($(this).data('containerId') === $container.attr('id')) {
                $(this).remove();
            }
        });
    }

    function getOffsetSum(elem) {
        var top = 0, left = 0;
        while (elem) {
            top = top + parseInt(elem.offsetTop);
            left = left + parseInt(elem.offsetLeft);
            elem = elem.offsetParent;
        }

        return {
            top: top,
            left: left
        };
    }

    function getOffsetRect(elem, ignoreScroll) {
        let box = elem.getBoundingClientRect();
        let body = document.body;
        let docElem = document.documentElement;
        let scrollTop = ignoreScroll ? 0 : window.pageYOffset || docElem.scrollTop || body.scrollTop;
        let scrollLeft = ignoreScroll ? 0 : window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        let clientTop = docElem.clientTop || body.clientTop || 0;
        let clientLeft = docElem.clientLeft || body.clientLeft || 0;
        let top = box.top + scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;
        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    }
    //#endregion

    //#region Member Function

    //#region dummyDeferred
    this.dummyDeferred = function () {
        var def = Q.defer();
        def.resolve();
        return def.promise;
    };
    //#endregion

    //#region setup - 설정값을 가져오거나 설정합니다.
    /**
     * @description
     * BITCommon.js 의 설정을 세팅 합니다.
     * @param {any} opt 옵션은 다음과 같습니다.
     * @returns {object} option
     */
    this.setup = function (opt) {
        if ($this.isNull(opt)) {
            return defaultSetup;
        } else {
            return $.extend(defaultSetup, opt);
        }
    };
    //#endregion

    //#region getOffset - 현재 클라이언트에서 element의 offset 값을 찾는다.
    this.getOffset = function (element) {
        if (element.getBoundingClientRect) {
            return getOffsetRect(element);
        } else {
            return getOffsetSum(element);
        }
    };

    this.getOffsetIgnoreScroll = function (element) {
        if (element.getBoundingClientRect) {
            return getOffsetRect(element, true);
        } else {
            return getOffsetSum(element);
        }
    }
    //#endregion

    //#region validator - 사용자 정의 유효성 검사기 추가 항목들
    if (!$this.isNull($.validator)) {
        //#region validator.js의 함수 재정의
        $.validator.format = function (source, params) {
            if (arguments.length === 1) {
                return function () {
                    var args = $.makeArray(arguments);
                    args.unshift(source);
                    return $.validator.format.apply(this, args);
                };
            }
            if (arguments.length > 2 && params.constructor !== Array) {
                params = $.makeArray(arguments).slice(1);
            }
            if (params.constructor !== Array) {
                params = [params];
            }
            $.each(params, function (i, n) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                    // 수정 사항
                    if (typeof (n) === 'string') {
                        if (n.substring(0, 1) === '#') {
                            n = $.trim($(n).val());
                        }
                    }
                    return n;
                });
            });
            return source;
        };
        //#endregion

        //#region required 기능 추가
        $.validator.addMethod("customrequired", function (value, element, param) {
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["customrequired"] = obj.Message;
            }
            return $.trim(value) !== '';
        });
        //#endregion

        //#region afterToday 기능 추가
        // 지정된 날짜가 금일 이후인지 체크하는 유효성 검사기입니다.
        $.validator.addMethod("aftertoday", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["aftertoday"] = obj.Message;
            }
            var startDate = $this.convertToDate(new Date().toString("yyyy-MM-dd"));
            var endDate = $this.convertToDate($.trim(value));
            if ($this.isNull(endDate)) {
                return true;
            }
            if (obj.IsAllowedToday) {
                return startDate <= endDate;
            } else {
                return startDate < endDate;
            }
        });
        //#endregion

        //#region BeforeToday 기능 추가
        // 지정된 날짜가 금일 이후인지 체크하는 유효성 검사기입니다.
        $.validator.addMethod("beforetoday", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["beforetoday"] = obj.Message;
            }
            var startDate = $this.convertToDate(new Date().toString("yyyy-MM-dd"));
            var endDate = $this.convertToDate($.trim(value));
            if ($this.isNull(endDate)) {
                return true;
            }
            if (obj.IsAllowedToday) {
                return startDate >= endDate;
            } else {
                return startDate > endDate;
            }
        });
        //#endregion

        //#region 문자와 숫자로만 이루어 졌는지 체크하는 유효성 검사기입니다.
        $.validator.addMethod("alphanumeric", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["alphanumeric"] = obj.Message;
            }

            if (!obj.IsAllowedFirstDigit && /^\d+$/.test(value)) {
                return false;
            }
            var digitCount = 0;
            var alphaCount = 0;
            for (var i = 0; i < value.length; i++) {
                if (value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57) {
                    digitCount++;
                } else if ((value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90) || (value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122)) {
                    alphaCount++;
                } else {
                    return false;
                }
            }

            if (obj.MinRequiredAlphaCharacters > 0 || obj.MinRequiredNumericCharacters > 0) {
                if (digitCount < obj.MinRequiredNumericCharacters || alphaCount < obj.MinRequiredAlphaCharacters) {
                    return false;
                }
            }
            return true;
        });
        //#endregion

        //#region 문자와 숫자와 한글로만 이루어 졌는지 체크하는 유효성 검사기입니다.
        $.validator.addMethod("alphanumerickorean", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            let obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["alphanumerickorean"] = obj.Message;
            }

            return /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/.test(value);
        });
        //#endregion

        //#region 데이터의 형식 검증
        $.validator.addMethod("datatype", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["datatype"] = obj.Message;
            }

            if (obj.DataType === 'Number') {
                return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test($.trim(value));
            } else if (obj.DataType === 'Digits') {
                return /^\d+$/.test($.trim(value));
                // } else if (obj.DataType === 'Integer') {
                // return /^-?(\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test($.trim(value));
            } else if (obj.DataType === 'Date10') {
                if ($.trim(value).length !== 10) return false;
                var date = $this.convertToDate($.trim(value));
                return !$this.isNull(date) && date !== '';
            } else if (obj.DataType === 'Date7') {
                if ($.trim(value).length !== 7) return false;
                let date = null;
                if ($.trim(value).length === 7) {
                    date = $this.convertToDate($.trim(value) + '-01');
                } else if ($.trim(value).length === 6) {
                    value = $.trim(value).substring(0, 4) + '-' + $.trim(value).substring(4, 6);
                    date = $this.convertToDate(value + '-01');
                }
                if (Object.prototype.toString.call(date) === "[object Date]") {
                    if (isNaN(date.getTime())) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            } else if (obj.DataType === 'Email') {
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test($.trim(value));
            } else if (obj.DataType === 'TelNumber1') {
                if (value.indexOf('-') > 0) {
                    return /^(0\d{1,3}-|)\d{3,4}-\d{4}$/.test($.trim(value));
                } else {
                    return /^(0\d{1,3}|)\d{3,4}\d{4}$/.test($.trim(value.replace(/-/ig, '')));
                }
            } else if (obj.DataType === 'Url') {
                return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test($.trim(value));
            } else if (obj.DataType === 'Jumin') {
                if ((($.trim(value).length === 13) && /^\d{13}[0-9]*$/.test($.trim(value))) || (($.trim(value).length === 14) && value.substring(6, 7) === "-")) {
                    // 14자리일 경우 inputvalue를 13자리 형식으로 변경
                    if (($.trim(value).length === 14)) {
                        var valueSplit = value.split('-');

                        if (valueSplit[0].length === 6 && valueSplit[1].length === 7) {
                            value = valueSplit[0] + valueSplit[1];
                        } else {
                            return false;
                        }
                    }
                    var firstYear = "19";
                    if (($.trim(value).substring(6, 7) === "3") || ($.trim(value).substring(6, 71) === "4") || ($.trim(value).substring(6, 7) === "7") || ($.trim(value).substring(6, 7) === "8")) { // 2000년대생
                        firstYear = "20";
                    } else if (($.trim(value).substring(6, 7) === "0") || ($.trim(value).substring(6, 7) === "9")) { // 1800년대생
                        firstYear = "18";
                    }
                    // 숫자여부 체크
                    if (/^\d{13}[0-9]*$/.test($.trim(value))) {
                        // date형식 체크
                        var dateType = firstYear + $.trim(value).substring(0, 6);
                        if (!$this.isNull($this.convertToDate(dateType))) {
                            var count = 2;
                            var sum = 0;
                            var compareNum = 0;

                            for (var i = 0; i < $.trim(value).length - 1; i++) {
                                sum += $.trim(value).substring(i, i + 1) * count;
                                count++;
                                if (count > 9) {
                                    count = 2;
                                }
                            }
                            compareNum = 11 - (sum % 11);
                            if (compareNum >= 10) {
                                compareNum = compareNum % 10;
                            }
                            // 오류검증코드와 비교
                            if (compareNum === parseInt($.trim(value).substring(12, 13))) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            } else if (obj.DataType === 'BusinessNumber') {
                var inputValue = value.replace(/-/g, '');

                if (inputValue.length !== 10) // '-'를 제외한 나머지가 10자리 인지 판단.
                {
                    return false;
                }
                if (isNaN(inputValue)) // '-'를 제외한 나머지가 숫자인지 판단.
                {
                    return false;
                }

                var step1, step2, step3, step4, step5, step6, step7;
                var checkNo = "137137135";

                step1 = 0;

                for (let i = 0; i < 7; i++) {
                    step1 = step1 + (inputValue.substring(i, +i + 1) * checkNo.substring(i, i + 1));
                }

                step2 = step1 % 10;
                step3 = (inputValue.substring(7, 8) * checkNo.substring(7, 8)) % 10;
                step4 = inputValue.substring(8, 9) * checkNo.substring(8, 9);
                step5 = Math.round(step4 / 10 - 0.5);
                step6 = step4 - (step5 * 10);
                step7 = (10 - ((step2 + step3 + step5 + step6) % 10)) % 10;

                if (Number(inputValue.substring(9, 10)) !== step7) {
                    return false;
                }
                else {
                    return true;
                }
            }
        });
        //#endregion

        //#region datecompare 기능 추가
        $.validator.addMethod("datecompare", function (value, element, param) {
            var obj = param;
            var $form = $(element).closest('form');
            var $startDate = $form.find('[name="' + obj.StartPropertyName + '"]');
            var $endDate = $form.find('[name="' + obj.EndPropertyName + '"]');

            if ($.trim($startDate.val()) === '' || $.trim($endDate.val()) === '') {
                return true;
            }
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["datecompare"] = obj.Message;
            }
            var startDate = $this.convertToDate($.trim($startDate.val()));
            var endDate = $this.convertToDate($.trim($endDate.val()));
            if ($this.isNull(startDate) || $this.isNull(endDate)) {
                return true;
            }
            if (obj.IsAllowedEqual) {
                if (endDate >= startDate) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (endDate > startDate) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        //#endregion

        //#region restrictdate
        $.validator.addMethod("restrictdate", function (value, element, param) {
            var obj = param;
            var $form = $(element).closest('form');
            var $startDate = $form.find('[name="' + obj.StartDatePropertyName + '"]');
            var $endDate = $form.find('[name="' + obj.EndDatePropertyName + '"]');

            if ($.trim($startDate.val()) === '' || $.trim($endDate.val()) === '') {
                return true;
            }
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["restrictdate"] = obj.Message;
            }
            var startDate = $this.convertToDate($.trim($startDate.val()));
            var endDate = $this.convertToDate($.trim($endDate.val()));
            if ($this.isNull(startDate) || $this.isNull(endDate)) {
                return true;
            }

            switch (obj.RestrictionType) {
                case 'Day': {
                    endDate = startDate.addDay(obj.Number);
                    break;
                }
                case 'Week': {
                    endDate = startDate.addWeek(obj.Number);
                    break;
                }
                case 'Month': {
                    endDate = startDate.addMonth(obj.Number);
                    break;
                }
                case 'Year': {
                    endDate = startDate.addYear(obj.Number);
                    break;
                }
            }

            if (obj.IsAllowedToday) {
                if (startDate >= endDate) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (startDate > endDate) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        //#endregion

        //#region customfixedlength 기능 추가
        $.validator.addMethod("customfixedlength", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["customfixedlength"] = obj.Message;
            }

            return $.trim(value).length === obj.Length;
        });
        //#endregion

        //#region custommaxlength 기능 추가
        $.validator.addMethod("custommaxlength", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["custommaxlength"] = obj.Message;
            }

            return $.trim(value).length <= obj.Max;
        });
        //#endregion

        //#region customminlength 기능 추가
        $.validator.addMethod("customminlength", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["customminlength"] = obj.Message;
            }

            return $.trim(value).length >= obj.Min;
        });
        //#endregion

        //#region customrangelength 기능 추가
        $.validator.addMethod("customrangelength", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["customrangelength"] = obj.Message;
            }

            return $.trim(value).length >= obj.Min && $.trim(value).length <= obj.Max;
        });
        //#endregion

        //#region maxnumber 기능 추가
        $.validator.addMethod("maxnumber", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["maxnumber"] = obj.Message;
            }

            return $.trim(value) <= obj.Max;
        });
        //#endregion

        //#region minnumber 기능 추가
        $.validator.addMethod("minnumber", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["minnumber"] = obj.Message;
            }

            return $.trim(value) >= obj.Min;
        });
        //#endregion

        //#region rangenumberic 기능 추가
        $.validator.addMethod("rangenumberic", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }
            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["rangenumberic"] = obj.Message;
            }

            return $.trim(value) >= obj.Min && $.trim(value) <= obj.Max;
        });
        //#endregion

        //#region stringcompare 기능 추가
        $.validator.addMethod("stringcompare", function (value, element, param) {
            var obj = param;
            var $form = $(element).closest('form');
            var $firstString = $form.find('[name="' + obj.FirstPropertyName + '"]');
            var $secondString = $form.find('[name="' + obj.SecondPropertyName + '"]');

            if ($.trim($firstString.val()) === '' || $.trim($secondString.val()) === '') {
                return true;
            }
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["stringcompare"] = obj.Message;
            }

            return $.trim($secondString.val()) === $.trim($firstString.val());
        });
        //#endregion

        //#region password 기능 추가
        $.validator.addMethod("password", function (value, element, param) {
            if ($.trim(value) === '') {
                return true;
            }

            var obj = param;
            if (!$this.isNull(obj.Message)) {
                $.validator.messages["password"] = obj.Message;
            }

            var regLowLetter = /[a-z]/;
            var regUpperLetter = /[A-Z]/;
            var regDigit = /[0-9]/;
            var regSymbol = /[!,@,#,$,%,^,&,*,?,_,~]/;

            var isLowLetter = regLowLetter.test($.trim(value));
            var isUpperLetter = regUpperLetter.test($.trim(value));
            var isDigit = regDigit.test($.trim(value));
            var isSymbol = regSymbol.test($.trim(value));

            if (obj.ModeType === 'TwoWays') {
                if ($.trim(value).length >= 10) {
                    if ((isLowLetter && isUpperLetter) || (isLowLetter && isDigit) || (isLowLetter && isSymbol) || (isUpperLetter && isDigit) || (isUpperLetter && isSymbol) || (isDigit && isSymbol)) {
                        return true;
                    }
                }
            } else if (obj.ModeType === 'ThreeWays') {
                if ($.trim(value).length >= 8 && $.trim(value).length < 17) {
                    if ((isLowLetter && isUpperLetter && isDigit) || (isLowLetter && isUpperLetter && isSymbol) || (isLowLetter && isDigit && isSymbol) || (isUpperLetter && isDigit && isSymbol)) {
                        return true;
                    }
                }
            } else {
                return true;
            }

            return false;
        });
        //#endregion
    }
    //#endregion

    //#region validate - 폼의 유효성 검사.
    // 사용법 : <input id="userId" name="userId" type="text" validate="required:true;dateISO:true;direction:top;" />
    // validate 어트리뷰트에 세미콜론(;)을 구분자로 하여 문자열로 입력함,
    // 배열의 경우range:[1,5] 처럼..입력함
    // script 내에서 BIT.validate($('form'), function(response){}); 호출함
    // 주의 : required attribute가 없는데 계속 유효성 체크를 할 경우
    // jquery.validate.js 의 attributeRules 함수(851행 쯤..)에서
    // $element[0].getAttribute(method); 를 $element.attr(method); 로 변경
    this.validate = function () {
        let $form, extraDataName, callbackSuccess, callbackBeforeSubmit, callbackUploadProgress, callbackFailure;
        $form = arguments[0];
        if (arguments[1] && typeof arguments[1] === 'function') {
            callbackSuccess = arguments[1];
            if (arguments[2]) {
                callbackBeforeSubmit = arguments[2];
            }
            if (arguments[3]) {
                callbackUploadProgress = arguments[3];
            }
            if (arguments[4]) {
                callbackFailure = arguments[4];
            }
        } else if (arguments[1] && typeof arguments[1] === 'string' || typeof arguments[1] === 'undefined') {
            if (arguments[1]) {
                extraDataName = arguments[1];
            }
            if (arguments[2]) {
                callbackSuccess = arguments[2];
            }
            if (arguments[3]) {
                callbackBeforeSubmit = arguments[3];
            }
            if (arguments[4]) {
                callbackUploadProgress = arguments[4];
            }
            if (arguments[5]) {
                callbackFailure = arguments[5];
            }
        } else {
            alert('BIT.validate 함수의 두번째 매개변수를 확인 하십시오.');
            return;
        }

        var validator = $form.validate({
            ignoreTitle: true,
            ignore: null,
            focusCleanup: true,
            focusInvalid: defaultSetup.errorViewType === 'tooltip',
            highlight: function (error, element) {
                if (typeof (element) === 'string') {
                    // validate.js에서 defaultShowErrors() 함수의
                    // this.settings.highlight.call(this, error, error.element,
                    // this.settings.errorClass, this.settings.validClass); 처럼
                    // 변경하여야 함.
                    throw 'validate.js 가 재정의 되지 않았습니다.';
                }
                if (defaultSetup.errorViewType === 'tooltip') {
                    if (!$this.isNull($(element).data('elementname'))) {
                        var $displayEl = $(element).closest('form').find('[name="' + $(element).data('elementname') + '"]');
                        showValidatorTooltip($displayEl, error.message, $(element).data('validator-direction'));
                    } else {
                        showValidatorTooltip($(element), error.message, $(element).data('validator-direction'));
                    }
                }
            },
            unhighlight: function (element) {
                var $element = $(element);
                if (!$this.isNull($element.data('elementname'))) {
                    $element = $element.closest('form').find('[name="' + $element.data('elementname') + '"]');
                }
                $element.removeClass("validator_error");
                if (!$this.isNull($element.data('validator-tooltip'))) {
                    $element.data('validator-tooltip').hide();
                }
            },
            submitHandler: function (form) {
                let extraData = $(form).data(extraDataName);
                return $this.submit($(form), extraData, callbackSuccess, callbackBeforeSubmit, callbackUploadProgress, callbackFailure);
            },
            invalidHandler: function (form, validator) {
                let errorCount = validator.numberOfInvalids();
                if (errorCount && errorCount > 0) {
                    if (defaultSetup.errorViewType === 'tooltip') {
                        for (let i = 0; i < errorCount; i++) {
                            let msg = validator.errorList[i].message;
                            let $el = $(validator.errorList[i].element);
                            let $displayEl = null;
                            if (!$this.isNull(validator.errorList[i].elementName)) {
                                $displayEl = $el.closest('form').find('[name="' + validator.errorList[i].elementName + '"]');
                                if ($displayEl.length > 0) {
                                    $el.data('elementname', validator.errorList[i].elementName);
                                    showValidatorTooltip($displayEl, msg, $el.data('validator-direction'));
                                } else {
                                    showValidatorTooltip($el, msg, $el.data('validator-direction'));
                                }
                            } else {
                                showValidatorTooltip($el, msg, $el.data('validator-direction'));
                            }
                        }
                    } else if (defaultSetup.errorViewType === 'alert') {
                        $this.modal(validator.errorList[0].message, $this.messages.common_error_title, function () {
                            $(validator.errorList[0].element).focus();
                        });
                    }
                }
                return false;
            }
        });
        var $elements = $form.find("input, select, textarea").not(":submit, :reset, :image, [disabled]");
        $elements.each(function () {
            var $el = $(this);
            var str = $(this).attr('data-validate');
            try {
                if (!$this.isNull(str) && str.length > 0) {
                    var rules = str.split(';');
                    for (var i = 0; i < rules.length; i++) {
                        var name = $.trim(rules[i].split(':')[0]);
                        var value = rules[i].substring(rules[i].split(':')[0].length + 1); // 2014-12-04 변경
                        var args = {};
                        if (name === 'direction') { // 툴팁의 방향 top or bottom
                            $el.data('validator-direction', value);
                            continue;
                        } else if (name === '') {
                            continue;
                        }
                        if (value === 'true') {
                            value = true;
                        } else if (value === 'false') {
                            value = false;
                        } else if (value.substring(0, 1) === '[') { // 배열
                            value = JSON.parse(value);
                        } else if (value.substring(0, 1) === '{') { // Object
                            // '를 "로 변경한다.
                            value = JSON.parse(value.replace(/\'/g, '"'));
                        }
                        args[name] = value;
                        $el.rules('add', args);
                    }
                }
            } catch (e) {
                $this.modal(e.message, $this.messages.common_error_title);
            }
        });
        return validator;
    };
    //#endregion

    //#region showTooltip - tooltip
    // 사용법 : BIT.showTooltip($el, msg, 'bottom');
    this.showTooltip = function ($element, message, direction) {
        var offset = BIT.getOffset($element[0]);
        var $tooltip = {};
        if (direction === 'top') {
            $tooltip = $('<div class="validator_t_wrap"><div class="validator_tooltips"><div class="validator_tt_ttbl"><table class="validator_tt_tbl" style="border-collapse:collapse;border:none"><tr><td class="validator_tt_tl"></td><td colspan="2" class="validator_tt_ct"></td><td class="validator_tt_tr"></td></tr><tr><td class="validator_tt_ml"></td><td class="validator_tt_mc"><!-- 내용 --><div class="validator_tt_cnt">' + message + '</div></td><td class="validator_tt_mc"><!-- 닫기 버튼 --><div class="validator_tt_btn"><span class="validator_btn_ttclose"><span>close</span></span></div></td><td class="validator_tt_mr"></td></tr><tr><td class="validator_tt_bl"></td><td colspan="2" class="validator_tt_cb"></td><td class="validator_tt_br"></td></tr></table></div><div class="validator_tt_btm"></div></div></div>');
            $tooltip.css('left', offset.left + 10);
            $tooltip.css('top', offset.top - 40 + 5);
            $(document.body).append($tooltip);
        } else {
            $tooltip = $('<div class="validator_t_wrap"><div class="validator_tooltips_b"><div class="validator_tt_top"></div><div class="validator_tt_btbl"><table class="validator_tt_tbl" style="border-collapse:collapse;border:none"><tr><td class="validator_tt_tl"></td><td colspan="2" class="validator_tt_ct"></td><td class="validator_tt_tr"></td></tr><tr><td class="validator_tt_ml"></td><td class="validator_tt_mc"><!-- 내용 --><div class="validator_tt_cnt">' + message + '</div></td><td class="validator_tt_mc"><!-- 닫기 버튼 --><div class="validator_tt_btn"><span class="validator_btn_ttclose"><span>close</span></span></div></td><td class="validator_tt_mr"></td></tr><tr><td class="validator_tt_bl"></td><td colspan="2" class="validator_tt_cb"></td><td class="validator_tt_br"></td></tr></table></div></div></div>');
            $tooltip.css('left', offset.left + 10);
            $tooltip.css('top', offset.top + $element.height() - 5);
            $(document.body).append($tooltip);
        }
        $tooltip.data('element', $element);
        $element.data('tooltip', $tooltip);
        $('.validator_btn_ttclose', $tooltip).on('click', function () {
            $tooltip.remove();
        });
        var timer = setTimeout(function () {
            clearTimeout(timer);
            $tooltip.remove();
        }, defaultSetup.tooltipTimer);
        if ($element.closest('.modalContainer').length > 0) {
            $tooltip.data('containerId', $element.closest('.modalContainer').attr('id'));
        }
        return $tooltip;
    };
    //#endregion


    //#region 툴팁을 스크롤시에 재위치 시킵니다.
    // $('.content').scroll(function (event) {BIT.repositionTooltip();}
    this.repositionTooltip = function () {
        $('.validator_t_wrap').each(function () {
            let $element = $(this).data('element');
            if ($element.length > 0) {
                let offset = getOffsetRect($element[0], true);
                $(this).css('left', offset.left + 10);
                $(this).css('top', offset.top + $element.height() - 5);
            }
        });
    };
    //#endregion



    //#region 깊은 복사
    this.deepCopy = function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var copy = obj.constructor();
        for (let i = 0; i < Object.keys(obj).length; i++) {
            copy[Object.keys(obj)[i]] = $this.deepCopy(obj[Object.keys(obj)[i]]);
        }
        return copy;
    };
    //#endregion


    //#region a와 b개체의 값을 비교한다.
    this.valueEquals = function (a, b) {
        if (typeof a === 'function' || typeof b === 'function') {
            return true;
        }
        if (a === b) {
            return true;
        }
        if (typeof a === 'object' && typeof b === 'object') {
            if (Object.keys(a).length === Object.keys(b).length) {
                for (var i = 0; i < Object.keys(a).length; i++) {
                    if (BIT.isNull(b[Object.keys(a)[i]]) || !this.valueEquals(a[Object.keys(a)[i]], b[Object.keys(a)[i]])) {
                        return false;
                    }
                }
            } else {
                return false;
            }
            return true;
        } else {
            return false;
        }
    };
    //#endregion


    //#region makeForm - data로 form을 만듭니다.
    this.makeForm = function (name, type, action, data) {
        if ($this.isNull(type)) {
            type = 'post';
        }
        if ($this.isNull(data)) {
            data = {};
        }
        if (name.indexOf('?') > 0) {
            name = action.substring(0, action.indexOf('?'));
        }
        var reg = /[!@#$%^&*()_+|}{:"<>?\/\\,.]/ig;
        name = name.replace(reg, '');

        if (action.indexOf('?') > 0) {
            var arr = action.substring(action.indexOf('?') + 1).split('&');
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].indexOf('=') > 0) {
                    data[arr[i].split('=')[0]] = arr[i].split('=')[1];
                }
            }
            action = action.substring(0, action.indexOf('?'));
        }
        var $form = $('form[name^="' + name + '"]');
        if ($form.length > 0) {
            let equal = false;
            for (let i = 0; i < $form.length; i++) {
                if ($this.valueEquals($form.eq(i).data('formdata'), data)) {
                    $.each(data, function (name, value) {
                        if ($form.eq(i).find(':hidden[name="' + name + '"]').length > 0) {
                            $form.eq(i).find(':hidden[name="' + name + '"]').val(value);
                        } else {
                            let $hidden = $('<input type="hidden" name="' + name + '" />');
                            $hidden.val(value);
                            $form.eq(i).append($hidden);
                        }
                    });
                    equal = true;
                }
            }
            if (!equal) {
                $form = $('<form name="' + name + '_' + $this.getRandomString(8) + '" method="' + type + '" action="' + action + '"></form>');
                $form.data('formdata', data);
                $.each(data, function (name, value) {
                    let $hidden = $('<input type="hidden" name="' + name + '" />');
                    $hidden.val(value);
                    $form.append($hidden);
                });
                $('body').append($form);
            }
        } else {
            $form = $('<form name="' + name + '" method="' + type + '" action="' + action + '"></form>');
            $form.data('formdata', data);

            $.each(data, function (name, value) {
                let $hidden = $('<input type="hidden" name="' + name + '" />');
                $hidden.val(value);
                $form.append($hidden);
            });
            $('body').append($form);
        }
        return $form;
    };
    //#endregion

    //#region callAjax - ajax 호출 함수
    // 사용법 : callAjax('Services/GetFirstAddress.aspx', 'POST', {}, function
    // (responseText) { do something..});
    this.callAjax = function (url, type, data, callbackSuccess, callbackFailure, callbackBeforeSubmit, callbackUploadProgress) {
        var deferred = Q.defer();
        var $form = $this.makeForm(url, type, url, data);
        if (url.indexOf('?') > 0) {
            url = url.substring(0, url.indexOf('?'));
        }
        if (typeof $form[0].submitted === 'undefined') {
            $form[0].submitted = true;
        } else {
            //$this.modal(BIT.messages.common_invalid_request, BIT.messages.common_error_title);
            return $this.dummyDeferred();
        }

        var timeData = {
            Time: new Date().toString('yyyy-MM-dd HH:mm:ss')
        };
        data = $.extend({}, timeData, data);
        $form.ajaxSubmit({
            dataType: 'json',
            type: type,
            success: function (response, statusText, xhr) {
                delete $form[0].submitted;
                $form.remove();
                preProccessSubmit(response);
                if (!$this.isNull(callbackSuccess)) {
                    callbackSuccess(response, status, xhr);
                }
                if (response.IsSucceed) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response);
                }
            },
            encrypt: function (sourceData) {
                if (!$this.isNull(sourceData) && !$this.isNull(window["CryptoJS"]) && defaultSetup.useClientEncrypt && !$this.isNull(aesValue)) {
                    var key = CryptoJS.enc.Utf8.parse(aesValue.key);
                    var iv = CryptoJS.enc.Utf8.parse(aesValue.iv);
                    var encrypted = CryptoJS.AES.encrypt(sourceData, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
                    return 'EncryptedRequest=' + encrypted.ciphertext.toString();
                } else {
                    return sourceData;
                }
            },
            beforeSubmit: function (arr, $form, options) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].type === 'file')
                        continue;
                    arr[i].value = $.trim(arr[i].value);
                }
                if (!$this.isNull(callbackBeforeSubmit)) {
                    callbackBeforeSubmit(arr, $form, options);
                }
            },
            uploadProgress: function (event, position, total, percentComplete) {
                if (!$this.isNull(callbackUploadProgress)) {
                    callbackUploadProgress(event, position, total, percentComplete);
                }
            },
            error: function (xhr, status, errorThrown) {
                delete $form[0].submitted;
                $form.remove();
                if (!$this.isNull(callbackFailure)) {
                    callbackFailure(xhr, status, errorThrown);
                } else {
                    if (defaultSetup.mode === 'Release') {
                        $this.modal($this.messages.common_server_error, $this.messages.common_error_title);
                    } else {
                        $this.modalDialog({
                            content: $this.changeBr(xhr.responseText),
                            title: $this.messages.common_error_title,
                            width: 1000,
                            height: 500,
                            resizable: true
                        });
                    }
                }
                deferred.reject();
            }
        });
        return deferred.promise;
    };
    //#endregion

    //#region callSjax - 동기 호출 함수
    // 사용법 : callSjax('Services/GetFirstAddress.aspx', 'POST', {}, function
    // (responseText) { do something..});
    this.callSjax = function (url, type, data, callbackSuccess, callbackFailure) {
        var deferred = Q.defer();
        $.ajax({
            url: url,
            type: type,
            data: data,
            async: false,
            dataType: 'json',
            beforeSend: function (xhr, options) {
                if (options.type.toUpperCase() === 'GET') {
                    if (!$this.isNull(window["CryptoJS"]) && defaultSetup.useClientEncrypt && !$this.isNull(aesValue)) {
                        var arr = options.url.split('?');
                        if (arr.length > 1) {
                            var key = CryptoJS.enc.Utf8.parse(aesValue.key);
                            var iv = CryptoJS.enc.Utf8.parse(aesValue.iv);
                            var encrypted = CryptoJS.AES.encrypt(arr[1], key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
                            options.url = arr[0] + '?EncryptedRequest=' + encrypted.ciphertext.toString();
                        }
                    }
                    options.data = null;  // data is null for 'get'
                }
                else {
                    if (!$this.isNull(options.data) && !$this.isNull(window["CryptoJS"]) && defaultSetup.useClientEncrypt && !$this.isNull(aesValue)) {
                        key = CryptoJS.enc.Utf8.parse(aesValue.key);
                        iv = CryptoJS.enc.Utf8.parse(aesValue.iv);
                        arr = options.url.split('?');
                        var data = options.data;
                        if (arr.length > 1) {
                            options.data = arr[1] + '&' + data;
                            options.url = arr[0];
                            data = options.data;
                        }
                        encrypted = CryptoJS.AES.encrypt(options.data, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
                        options.data = 'EncryptedRequest=' + encrypted.ciphertext.toString();
                    }
                }
            },
            success: function (response, status, xhr) {
                preProccessSubmit(response);
                if (!$this.isNull(callbackSuccess)) {
                    callbackSuccess(response, status, xhr);
                }
                if (response.IsSucceed) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response);
                }
            },
            error: function (xhr, status, errorThrown) {
                if (!$this.isNull(callbackFailure)) {
                    callbackFailure(xhr, status, errorThrown);
                } else {
                    if (defaultSetup.mode === 'Release') {
                        $this.modal($this.messages.common_server_error, $this.messages.common_error_title);
                    } else {
                        $this.modalDialog({
                            content: $this.changeBr(xhr.responseText),
                            title: $this.messages.common_error_title,
                            width: 1000,
                            height: 500,
                            resizable: true
                        });
                    }
                }
                deferred.reject();
            }
        });
    };
    //#endregion

    //#region submit - 폼의 서밋
    this.submit = function () {
        let $form, extraData, callbackSuccess, callbackBeforeSubmit, callbackUploadProgress, callbackFailure;
        $form = arguments[0];
        if (arguments[1] && typeof arguments[1] === 'function') {
            callbackSuccess = arguments[1];
            if (arguments[2]) {
                callbackBeforeSubmit = arguments[2];
            }
            if (arguments[3]) {
                callbackUploadProgress = arguments[3];
            }
            if (arguments[4]) {
                callbackFailure = arguments[4];
            }
        } else if (arguments[1] && typeof arguments[1] === 'object' || typeof arguments[1] === 'undefined') {
            if (arguments[1]) {
                extraData = arguments[1];
            }
            if (arguments[2]) {
                callbackSuccess = arguments[2];
            }
            if (arguments[3]) {
                callbackBeforeSubmit = arguments[3];
            }
            if (arguments[4]) {
                callbackUploadProgress = arguments[4];
            }
            if (arguments[5]) {
                callbackFailure = arguments[5];
            }
        } else {
            //function 도 아니고 object 도 아니면..
            alert('두번째 매개변수를 확인 하십시오.');
            return;
        }

        var deferred = Q.defer();
        let data = $form.getObject();
        if ($this.isNull($form[0].formdata)) {
            $form[0].formdata = data;
        } else {
            if ($this.valueEquals($form[0].formdata, data)) {
                //double submit !!!
                return $this.dummyDeferred();
            }
        }

        $form.ajaxSubmit({
            dataType: 'json',
            type: 'POST',
            data: extraData,
            success: function (response, statusText, xhr) {
                delete $form[0].formdata;
                preProccessSubmit(response, $form);
                if (!$this.isNull(callbackSuccess)) {
                    callbackSuccess(response, status, xhr);
                }
                if (response.IsSucceed) {
                    deferred.resolve(response);
                } else {
                    deferred.reject(response);
                }
            },
            encrypt: function (sourceData) {
                if (!$this.isNull(sourceData) && !$this.isNull(window["CryptoJS"]) && defaultSetup.useClientEncrypt && !$this.isNull(aesValue)) {
                    var key = CryptoJS.enc.Utf8.parse(aesValue.key);
                    var iv = CryptoJS.enc.Utf8.parse(aesValue.iv);
                    var encrypted = CryptoJS.AES.encrypt(sourceData, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 });
                    return 'EncryptedRequest=' + encrypted.ciphertext.toString();
                } else {
                    return sourceData;
                }
            },
            beforeSubmit: function (arr, $form, options) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].type === 'file')
                        continue;
                    arr[i].value = $.trim(arr[i].value);
                }
                if (!$this.isNull(callbackBeforeSubmit)) {
                    callbackBeforeSubmit(arr, $form, options);
                }
            },
            uploadProgress: function (event, position, total, percentComplete) {
                if (!$this.isNull(callbackUploadProgress)) {
                    callbackUploadProgress(event, position, total, percentComplete);
                }
            },
            error: function (xhr, status, errorThrown) {
                delete $form[0].formdata;
                if (!$this.isNull(callbackFailure)) {
                    callbackFailure(xhr, status, errorThrown);
                } else {
                    if (defaultSetup.mode === 'Release') {
                        $this.modal($this.messages.common_server_error, $this.messages.common_error_title);
                    } else {
                        $this.modalDialog({
                            content: $this.changeBr(xhr.responseText),
                            title: $this.messages.common_error_title,
                            width: 1000,
                            height: 500,
                            resizable: true
                        });
                    }
                }
                deferred.reject();
            }
        });
        return deferred.promise;
    };
    //#endregion

    //#region afterSubmitProccess - BITCommon.js 가 아닌 외부의 submit으로 json 결과를 받은 후 preProccessSubmit 함수를 태우고자 할경우에만 쓴다.
    this.afterSubmitProccess = function (responseText, $form) {
        preProccessSubmit(responseText, $form);
    };
    //#endregion

    //#region modal - 모달 다이얼로그
    this.modal = function (text, title, callbackClose) {
        if ($this.isNull(title) || title === '') {
            title = $this.messages.common_info_title;
        }
        let $dialog = null;
        if (defaultSetup.modalType === 'alert') {
            alert(text);
            if (!$this.isNull(callbackClose)) {
                callbackClose();
            }
            return null;
        } else {
            let parent = getParent(window);
            let $content = parent.$('<div><a href="javascript:;"></a></div>');
            $content.append(text);
            $dialog = $content.dialog({
                autoOpen: true,
                title: title,
                resizable: false,
                modal: true,
                closeOnEscape: false,
                close: function (event, ui) {
                    $content.closest('.modalContainer').remove();
                    if (!$this.isNull(callbackClose)) {
                        callbackClose(event, ui);
                    }
                },
                buttons: [{
                    text: $this.messages.common_modal_button_text,
                    click: function () {
                        $content.dialog("close");
                    }
                }]
            });
            var max_zIndex = 99999;
            $('.modalContainer').each(function () {
                var zIndex = parseInt($(this).css('z-index'));
                max_zIndex = Math.max(max_zIndex, zIndex);
            });
            $content.parent().addClass('modalContainer').addClass('alert').css('z-index', max_zIndex + 2);
            $content.parent().next().css('z-index', max_zIndex + 1);
            $content.parent().find('button:last').focus();
            return $dialog;
        }
    };
    //#endregion

    //#region confirmUI - 컨펌 다이얼로그
    this.confirmUI = function (text, title, callbackOkClose, callbackCancelClose, callbackClose) {
        if ($this.isNull(title) || title === '') {
            title = $this.messages.common_info_title;
        }
        let $dialog = null;
        if (defaultSetup.modalType === 'alert') {
            if (confirm(text)) {
                if (!$this.isNull(callbackOkClose)) {
                    callbackOkClose();
                }
            } else {
                if (!$this.isNull(callbackCancelClose)) {
                    callbackCancelClose();
                }
            }
            return null;
        } else {
            var parent = getParent(window);
            var $content = parent.$('<div><a href="javascript:;"></a></div>');
            $content.append(text);
            $dialog = $content.dialog({
                autoOpen: true,
                title: title,
                resizable: false,
                closeOnEscape: false,
                modal: true,
                close: function (event, ui) {
                    console.log('close');
                    $content.closest('.modalContainer').remove();
                    if (!$this.isNull(callbackClose)) {
                        callbackClose(event, ui);
                    }
                },
                buttons: [{
                    text: $this.messages.common_confirm_button_confirm_title,
                    click: function () {
                        console.log('ok close');
                        if (!$this.isNull(callbackOkClose)) {
                            callbackOkClose();
                        }
                        $content.dialog("close");
                    }
                }, {
                    text: $this.messages.common_confirm_button_cancel_title,
                    click: function () {
                        console.log('cancel close');
                        if (!$this.isNull(callbackCancelClose)) {
                            callbackCancelClose();
                        }
                        $content.dialog("close");
                    }
                }]
            });
            var max_zIndex = 99999;
            $('.modalContainer').each(function () {
                var zIndex = parseInt($(this).css('z-index'));
                max_zIndex = Math.max(max_zIndex, zIndex);
            });
            $content.parent().addClass('modalContainer').addClass('confirm').css('z-index', max_zIndex + 2);
            $content.parent().next().css('z-index', max_zIndex + 1);
            $content.parent().find('button:last').focus();
            return $dialog;
        }
    };
    //#endregion

    //#region modalDialog - 팝업을 띄웁니다.
    // 1. 모달 호출
    // $('#btn').click(function () {
    // var options = {
    //    url: '',
    //    width: 576,
    //    height: 670,
    //    closeCallback: null,
    //    openCallback: null, //selector
    //    title: '',
    //    data: {},
    //    modal: true
    //};
    //    var $dialog = BIT.modalDialog(options);
    //    function okCallback($dialog) {
    //        if (!$this.isNull($dialog.data('data'))) {
    //           something....
    //        }
    //    }
    // });
    // 2. parent 로 값 전달
    //  모달에서 부모페이지로 데이터를 전달 하는 방법은..
    //  $(this).closest('.modalContainer').data('data', somedata);
    // 3. 프로그램적으로 모달을 닫기 위해서는 BIT.modalDialogCloseClick(containerId); 함수를 호출한다.
    // 4. modalDialog 함수의 매개변수로 입력된 options 개체에 접근하는 방법은
    // iframe 을 사용하지 않을경우
    // var $container = $('#fileupload').closest('div[id^=container_]');
    // iframe 을 사용할 경우
    // var $container = window.top.$('#' + $.getUrlVar('containerId'));
    // var data = $container.data('options').data;
    this.modalDialog = function (options) {
        var $block = $('<div style="width:100%;height:100%;z-index:99999;position:fixed;top:0;left:0;background:transparent"></div>');
        var defaults = {
            iframe: false,
            url: '',
            content: '', //url 값이 있으면 url 값을 우선 처리한다.
            width: 576,
            height: 670,
            closeCallback: null,
            openCallback: null,
            title: '',
            data: {},
            buttonType: 0,
            modal: true,
            resizable: false,
            minWidth: 576,
            minHeight: 670,
            minimizeTitleWidth: 200,
            collapsable: false,
            dblclick: false,
            maximizable: false,
            minimizable: false
        };

        var dt = new Date().getTime();
        var opts = $.extend({}, defaults, options);
        if (opts.width > opts.maxWidth) {
            opts.maxWidth = opts.width;
        }
        if (opts.height > opts.maxHeight) {
            opts.maxHeight = opts.height;
        }
        if (opts.width < opts.minWidth) {
            opts.minWidth = opts.width;
        }
        if (opts.height < opts.minHeight) {
            opts.minHeight = opts.height;
        }
        opts.data.containerId = 'container_' + dt.toString();
        if (opts.url.length > 0) {
            if (opts.url.indexOf('?') > 0) {
                opts.url = opts.url + '&containerId=' + opts.data.containerId + '&width=' + opts.width + '&height=' + opts.height;
            } else {
                opts.url = opts.url + '?containerId=' + opts.data.containerId + '&width=' + opts.width + '&height=' + opts.height;
            }
        }

        var parent = getParent(window);
        var $container = null;
        var $content = null;
        var $dialog = null;
        if (opts.iframe) {
            var $iframe = $('<iframe frameborder="0" width="100%" marginheight="0" marginwidth="0" scrolling="no" src=""/>');
            $iframe.attr('height', opts.height - 60);
            $content = $('<div id="content_' + dt.toString() + '" class="modalContent scrollbar" style="overflow-x:none; overflow-y:auto;width:100%; padding:0 0 0 0;" />');
            $dialog = $content.dialog({
                autoOpen: true,
                title: opts.title,
                resizable: opts.resizable,
                minHeight: opts.minHeight,
                maxHeight: opts.maxHeight,
                minWidth: opts.minWidth,
                maxWidth: opts.maxWidth,
                modal: opts.modal,
                width: opts.width,
                height: convertHeightToIntFromPercent(opts.height),
                closeOnEscape: false
            }).dialogExtend({
                "closable": true,
                "maximizable": opts.maximizable,
                "minimizable": opts.minimizable,
                "collapsable": opts.collapsable,
                "dblclick": opts.dblclick,
                "titlebar": false,
                "minimizeLocation": "left",
                "minimizeTitleWidth": opts.minimizeTitleWidth,
                "icons": {
                    "close": "ui-icon-closethick",
                    "maximize": "ui-icon-arrow-4-diag",
                    "minimize": "ui-icon-minus",
                    "collapse": "ui-icon-triangle-1-s",
                    "restore": "ui-icon-newwin"
                },
                "maximize": function (evt, dlg) {
                    $(evt.target).trigger('dialogresizestop', {
                        size:
                            {
                                width: $(evt.target).width(),
                                height: $(evt.target).height()
                            }
                    });
                },
                "restore": function (evt, dlg) {
                    $(evt.target).trigger('dialogresizestop', {
                        size:
                            {
                                width: $(evt.target).width(),
                                height: $(evt.target).height()
                            }
                    });
                }
            });

            $container = $content.parent('div');
            $container.attr('id', 'container_' + dt.toString());
            $container.addClass('modalContainer').addClass('popup');
            $container.data('options', opts);
            $content.append($iframe);
            $iframe.attr('src', opts.url);

            $container.find('.ui-dialog-titlebar-close').click(function (e) {
                e.preventDefault();
                if (opts.closeCallback) {
                    opts.closeCallback($container);
                }
                $content.dialog('close');
                triggerCloseModal($container);
                setTimeout(function () {
                    $container.remove();
                }, 1000);
            });

            $container.bind("dialogdragstart", function () {
                $('.validator_t_wrap').each(function (index) {
                    if ($(this).data('containerId') === $container.attr('id')) {
                        $(this).remove();
                    }
                });
            });
            $content.find('input, textarea, select').not(':disabled,:hidden').first().focus();
            if (opts.openCallback) {
                opts.openCallback($container);
            }
        } else {
            $content = $('<div id="content_' + dt.toString() + '" class="modalContent scrollbar" style="overflow-x:none; overflow-y:auto; width:100%; padding:0 0 0 0;" >');

            createDialog();
        }

        function createDialog() {
            $dialog = $content.dialog({
                autoOpen: true,
                title: opts.title,
                resizable: opts.resizable,
                minHeight: opts.minHeight,
                maxHeight: opts.maxHeight,
                minWidth: opts.minWidth,
                maxWidth: opts.maxWidth,
                modal: opts.modal,
                width: opts.width,
                height: convertHeightToIntFromPercent(opts.height),
                closeOnEscape: false
            }).dialogExtend({
                "closable": true,
                "maximizable": opts.maximizable,
                "minimizable": opts.minimizable,
                "collapsable": opts.collapsable,
                "dblclick": opts.dblclick,
                "titlebar": false,
                "minimizeLocation": "left",
                "minimizeTitleWidth": opts.minimizeTitleWidth,
                "icons": {
                    "close": "ui-icon-closethick",
                    "maximize": "ui-icon-arrow-4-diag",
                    "minimize": "ui-icon-minus",
                    "collapse": "ui-icon-triangle-1-s",
                    "restore": "ui-icon-newwin"
                },
                "maximize": function (evt, dlg) {
                    $(evt.target).trigger('dialogresizestop', {
                        size:
                            {
                                width: $(evt.target).width(),
                                height: $(evt.target).height()
                            }
                    });
                },
                "restore": function (evt, dlg) {
                    $(evt.target).trigger('dialogresizestop', {
                        size:
                            {
                                width: $(evt.target).width(),
                                height: $(evt.target).height()
                            }
                    });
                }
            });

            $container = $content.parent('div');
            $container.attr('id', 'container_' + dt.toString());
            $container.addClass('modalContainer').addClass('popup');
            $container.data('options', opts);

            if (opts.url.length > 0) {
                $content.append('<div class="modal-loader"><div class= "txt-area"><p class="big-text">' + $this.messages.common_loading + '</p><p class="small-text">' + $this.messages.common_wait + '</p></div></div>');
                $.ajax({
                    headers: {
                        RequestMethod: 'async'
                    },
                    url: opts.url,
                    beforeSend: function () {
                    },
                    dataType: 'html',
                    success: function (data) {
                        appendData(data);
                    }
                });
            } else {
                appendData(opts.content);
            }
        }

        function appendData(data) {
            $content.empty().append(data);
            $content.prev().find('button').click(function (e) {
                e.preventDefault();
                if (opts.closeCallback) {
                    opts.closeCallback($container);
                }
                triggerCloseModal($container);
                $dialog.dialog('close');
                $dialog.closest('.modalContainer').remove();
            });
            $container.bind("dialogdragstart", function () {
                $('.validator_t_wrap').each(function (index) {
                    if ($(this).data('containerId') === $container.attr('id')) {
                        $(this).remove();
                    }
                });
            });
            $(window).scroll(function (event) {
                $('.validator_t_wrap').each(function (index) {
                    if ($(this).data('containerId') === $container.attr('id')) {
                        $(this).remove();
                    }
                });
            });
            $content.find('input, textarea, select').not(':disabled,:hidden').first().focus();
            $block.remove();
            if (opts.openCallback) {
                opts.openCallback($container);
            }
        }

        function convertHeightToIntFromPercent(percent) {
            if (!Number(percent) && percent.substring(percent.length - 1) === '%') {
                return $('body').height() * 0.01 * parseInt(percent.substring(0, percent.length - 1));
            } else {
                return percent;
            }
        }
        return $dialog;
    };
    //#endregion

    //#region modalDialogCloseClick - 모달을 닫기 위해서는 이 함수를 호출 한다.
    this.modalDialogCloseClick = function (containerId) {
        var $container = {};
        if ($.getUrlVar('containerId') !== '' && !$this.isNull($.getUrlVar('containerId'))) {   //iframe
            $container = $(parent.document).find('#' + containerId);
            $container.children().first().find('button').trigger('click');
            triggerCloseModal($container);
        } else {                                                                        //inline
            if (!containerId) {
                $this.modal('containerId를 입력하십시오.', $this.messages.common_error_title);
            } else {
                $container = $(parent.document).find('#' + containerId);
                triggerCloseModal($container);
                $container.children().first().find('button').trigger('click');
                $container.remove();
            }
        }
    };
    //#endregion

    //#region getMessage - {0}{1} 형식의 포맷화된 문자열을 값을 채워 반환합니다.
    this.getMessage = function (text, params) {
        function format(source, params) {
            if (arguments.length === 1) {
                return function () {
                    var args = $.makeArray(arguments);
                    args.unshift(source);
                    return format.apply(this, args);
                };
            }
            if (arguments.length > 2 && params.constructor !== Array) {
                params = $.makeArray(arguments).slice(1);
            }
            if (params.constructor !== Array) {
                params = [params];
            }
            $.each(params, function (i, n) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                    return n;
                });
            });
            return source;
        }

        let theregex = /\$?\{(\d+)\}/g;
        text = format(text.replace(theregex, "{$1}"), params);
        return text;
    };
    //#endregion

    //#region bindListData - list 데이터를 그리드 형태로 바인딩합니다
    this.bindListData = function (listData, options) {
        let defaults = {
            prefix: '',
            $parent: '',
            $templete: null, // 필수 입력 사항입니다. 일반적인 table의 경우 tbody내부의 tr 한개...
            $container: null            // 필수 입력 사항입니다. 일반적인 table의 경우 tbody
        };
        let opts = $.extend({}, defaults, options);
        if ($this.isNull(opts.$templete) || opts.$templete.length === 0) {
            $this.modal('템플릿의 기준이 될 selector를 입력 하십시오.', $this.messages.common_error_title);
            return false;
        }
        if ($this.isNull(opts.$container) || opts.$container.length === 0) {
            $this.modal('데이터를 바인딩 할 container selector를 입력 하십시오.', $this.messages.common_error_title);
            return false;
        }

        let $item = $(opts.$templete[0].outerHTML); // 기준 템플릿을 하나 복사한다.
        opts.$container.empty();

        for (let i = 0; i < listData.length; i++) {
            let $clone = $item.clone();
            $this.bindObjectData(listData[i], {
                prefix: opts.prefix,
                $parent: $clone
            });
            opts.$container.append($clone[0].outerHTML);
        }
    };
    //#endregion

    //#region bindObjectData - object 형식의 데이터를 html 컨트롤에 바인딩합니다. 특정 요소의 자식컨트롤에 바인딩 하기 위해서는 $parent 에 값을 넣으세요
    this.bindObjectData = function (data, options) {
        let opts = {};
        if (options) {
            let defaults = {
                prefix: '',
                $parent: $('body')
            };
            opts = $.extend({}, defaults, options);
        } else {
            opts = {
                prefix: '',
                $parent: $('body')
            };
        }
        $.each(data, function (name, value) {
            let $obj = null;
            if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                    $this.bindObjectData(value[i], {
                        prefix: name + '[' + i + '].',
                        $parent: opts.$parent
                    });
                }
            } else if (value instanceof Object) {
                $this.bindObjectData(value, {
                    prefix: name + '.',
                    $parent: opts.$parent
                });
            }
            $obj = opts.$parent.find('[name="' + (opts.prefix !== '' ? opts.prefix : '') + name + '"]');
            if ($obj.length === 0) {
                $obj = opts.$parent.find('#' + (opts.prefix !== '' ? opts.prefix : '') + name);
            }
            if ($obj.length > 0) {
                $obj.each(function () {
                    if ($(this).is(':radio')) {
                        $(this).each(function () {
                            if ($(this).val() === value.toString() || value.toString().toLowerCase() === 'true') {
                                opts.$parent.find(':radio[name="' + $(this).attr('name') + '"]').each(function () {
                                    $(this).data('checked', false);
                                });
                                $(this)[0].checked = true;
                                $(this).data('checked', true);
                            }
                        });
                        $(this).trigger('change');
                    }
                    if ($(this).is(':checkbox')) {
                        if ($(this).length) {
                            if (!$this.isNull(value)) {
                                let arr = value.split(',');
                                $(this).each(function () {
                                    for (let i = 0; i < arr.length; i++) {
                                        if (arr[i].toLowerCase() === 'n') {
                                            $(this)[0].checked = false;
                                            $(this).val('N');
                                        } else if (arr[i].toLowerCase() === 'y') {
                                            $(this)[0].checked = true;
                                            $(this).val('Y');
                                        } else if ($(this).val() === arr[i] || arr[i].toLowerCase() === 'true') {
                                            $(this)[0].checked = true;
                                        }
                                        $(this).trigger('change');
                                    }
                                });
                            }
                        }
                    }
                    if ($(this).is(':password')) {
                        $(this).val('');
                    }
                    if ($(this).is('input, textarea') && !$(this).is(':radio') && !$(this).is(':checkbox')) {
                        $(this).val($this.htmlDecode(value));
                    }
                    if ($(this).is('select')) {
                        if ($(this).val() !== value) {
                            $(this).val(value).trigger('change');
                        }
                    }
                    if ($(this).is('img')) {
                        $(this).attr('src', '/uploadFiles' + value);
                    }
                    if ($(this).is('span,label')) {
                        $(this).html($this.changeBr(value));
                    }
                    if ($(this).is('pre')) {
                        $(this).html(value);
                    }
                });
            }
        });
    };
    //#endregion

    //#region changeBr - 캐리지 리턴 대신 br 태크를 삽입한다
    this.changeBr = function (str) {
        if (typeof str === 'string') {
            if ($this.isNull(str) || str === '')
                return '';
            return str.replace(/\\n/g, "<br/>").replace(/\n/g, "<br/>");
        } else if (typeof str === 'boolean') {
            return str.toString();
        } else {
            return str;
        }
    };
    //#endregion

    //#region htmlDecode - Script 단에서 인코딩된 html을 decoding 합니다.
    this.htmlDecode = function (str) {
        if ($this.isNull(str)) return str;
        //순서 매우 중요함...
        if (typeof str !== 'string') str = str.toString();
        return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, "'").replace(/&apos;/g, "'");
    };
    //#endregion

    //#region bindSelect -  select 에다가 바인딩 합니다.
    //   containsZeroIndex 가 true 이면 $target의 0 index의 아이템은 제거하지 않습니다.
    this.bindSelect = function ($target, url, method, data, containsZeroIndex, key, value, callback) {
        return $this.callAjax(url, method, data, function (response) {
            if (response.IsSucceed) {
                if (containsZeroIndex) {
                    $target.find('option:not(:eq(0))').remove();
                } else {
                    $target.find('option').remove();
                }
                var data = response.Data;
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        $target.append('<option value="' + data[i][key] + '">' + data[i][value] + '</option>');
                    }
                }

                if (!$this.isNull(callback)) {
                    callback(response);
                }
            }
        });
    };
    //#endregion

    //#region bindSelectDummy - select 에다가 빈 값을 바인딩 합니다.
    this.bindSelectDummy = function ($target, message) {
        $target.find('option').remove();
        $target.append('<option value="">' + message + '</option>');
    };
    //#endregion

    //#region convertToDate - 문자열을 Date 형식으로 바꿉니다. 입력 매개변수의 포맷은 yyyyMMdd 또는 yyyy-MM-dd 또는 yyyy-MM-dd HH:mm:ss
    this.convertToDate = function (data) {
        let y = null;
        let m = null;
        let d = null;
        let test = function (format, value) {
            if (format.indexOf('yyyy') >= 0) {
                y = data.substr(format.indexOf('yyyy'), 4);
            }
            if (format.indexOf('MM') >= 0) {
                m = data.substr(format.indexOf('MM'), 2);
            }
            if (format.indexOf('dd') >= 0) {
                d = data.substr(format.indexOf('dd'), 2);
            }
            let reg = /^((((19|2[0-9])(0[048]|[2468][048]|[13579][26])))-02-29)$|^(((19|2[0-9])[0-9]{2})-02-(0[1-9]|1[0-9]|2[0-8]))$|^(((19|2[0-9])[0-9]{2})-(0[13578]|10|12)-(0[1-9]|[12][0-9]|3[01]))$|^(((19|2[0-9])[0-9]{2})-(0[469]|11)-(0[1-9]|[12][0-9]|30))$/g;
            if (reg.test(y + '-' + m + '-' + d)) {
                return new Date(y, parseInt(m) - 1, d, 0, 0, 0);
            } else {
                return '';
            }
        };

        if (typeof data === 'string') {
            try {
                if (data.length === 8) {
                    let reg8 = /^((((19|2[0-9])(0[48]|[2468][048]|[13579][26])))0229)$|^(((19|2[0-9])[0-9]{2})02(0[1-9]|1[0-9]|2[0-8]))$|^(((19|2[0-9])[0-9]{2})(0[13578]|10|12)(0[1-9]|[12][0-9]|3[01]))$|^(((19|2[0-9])[0-9]{2})(0[469]|11)(0[1-9]|[12][0-9]|30))$/g;
                    if (reg8.test(data)) {
                        return new Date(data.substr(0, 4), parseInt(data.substr(4, 2)) - 1, data.substr(6, 2), 0, 0, 0);
                    } else {
                        return '';
                    }
                } else if (data.length === 10) {
                    let result = test(date_locale.format, data);
                    if (result === '') {
                        return test('yyyy-MM-dd', data);
                    } else {
                        return result;
                    }
                } else if (data.indexOf('오전') > 0 || data.indexOf('오후') > 0) {
                    if (data.indexOf('오전') > 0) {
                        return $this.convertToDate(data.replace('오전 ', ''));
                    } else {
                        return $this.convertToDate(data.replace('오후 ', '')).addHours(12);
                    }
                } else if ($.trim(data.length) > 10) {
                    let dt = $this.convertToDate(data.substr(0, 10));
                    if (dt === '') {
                        return dt;
                    } else {
                        let t = $.trim(data.substr(10).replace('T', ''));
                        let regTime = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d).*$/g;
                        if (regTime.test(t)) {
                            return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), t.substr(0, 2), t.substr(3, 2), t.substr(6, 2));
                        } else {
                            return '';
                        }
                    }
                }
            } catch (e) {
                return '';
            }
        }
        return '';
    };
    //#endregion

    //#region convertDateFromCSharpDate - c#의 날자 형식을 Date 형식으로 바꿉니다. 입력 매개변수의 포맷은 /Date(1323010800000)/
    this.convertDateFromCSharpDate = function (data) {
        if (data.length !== 21) {
            throw 'Invalid data';
        }
        return new Date(parseInt(data.substring(6, data.length - 2)));
    };
    //#endregion

    //#region formatFileSize - 파일크기를 포맷화 한다.
    this.formatFileSize = function (bytes) {
        if (typeof bytes !== 'number') {
            try {
                bytes = parseInt(bytes);
            } catch (e) {
                return '';
            }
        }
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }
        return (bytes / 1000).toFixed(2) + ' KB';
    };
    //#endregion

    //#region showImage - 이미지 뷰어 jquery.blockUI.js jquery.imageView.js 필요 http://4coder.info/en/
    this.showImage = function (imageFilePath, imageWidth, imageHeight) {
        let dt = new Date().getTime().toString();
        let $div = $('<div id="divImage_' + dt + '" style="display:none"></div>');
        $div.append('<img data-original="' + imageFilePath + '" src="javascript:;" />');
        $('body').prepend($div);
        new Viewer($('#divImage_' + dt)[0], {
            url: 'data-original',
            navbar: false
        }).show();
    };

    /*
    첫번째 인자에 img 태그들을 담고 있는 컨테이너 개체를 넣는다.
    이미지가 hidden 상태라면 명시적으로 show() 함수를 호출한다.
    */
    this.showImageList = function ($container) {
        if ($container[0]['viewer']) {
            return $container[0]['viewer'];
        } else {
            return new Viewer($container[0], {
                url: 'data-original',
                navbar: true
            });
        }
    };
    //#endregion

    //#region getTodayDate - 언어별 Today
    this.getTodayDate = function () {
        return new Date().toString(date_locale.format);
    };
    //#endregion

    //#region convertParameter - 주어진 url 에서 주어진 매개변수가 있으면 value를 교체하고 없으면 추가한다.
    this.convertParameter = function (url, param, value) {
        if ($.trim(url) === '') {
            return '';
        }
        var onlyUrl = '';
        var arr1 = url.split('?');
        var queryString = '';
        if (arr1.length === 2) {
            onlyUrl = arr1[0] + '?';
            queryString = arr1[1];
        } else {
            queryString = url;
        }
        var arr = queryString.split('&');
        var obj = {};
        var contains = false;
        for (var i = 0; i < arr.length; i++) {
            var kvArray = arr[i].split('=');
            if (kvArray[0] === param) {
                obj[kvArray[0]] = value;
                contains = true;
            } else {
                obj[kvArray[0]] = kvArray[1];
            }
        }
        if (!contains) {
            obj[param] = value;
        }

        return onlyUrl + $(obj).convertQueryString();
    };
    //#endregion

    //#region callFunction - 동적으로 function을 호출 합니다.
    this.callFunction = function (functionName, param1, param2, param3, param4, param5, param6, param7, param8) {
        var func = window[functionName];
        if (!$this.isNull(func)) {
            return func.call(this, param1, param2, param3, param4, param5, param6, param7, param8);
        }
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    };
    //#endregion

    //#region convertCollectionFromArray - javascript의 array 개체를 서밋하면 서버의 컬렉션으로 받을 수 있다.
    this.convertCollectionFromArray = function (collectionName, array, source) {
        var returnData = {};
        if (!$this.isNull(source)) {
            $.extend(returnData, source);
        }
        for (var i = 0; i < array.length; i++) {
            $.each(array[i], function (name, value) {
                returnData[collectionName + '[' + i + '].' + name] = value;
            });
            $.each(source, function (name, value) {
                returnData[collectionName + '[' + i + '].' + name] = value;
            });
        }
        return returnData;
    };
    //#endregion

    //#region convertMemberObjectFromObject - javascript의 object 개체를 서밋하면 서버의 MemberObject로 받을 수 있다.
    this.convertMemberObjectFromObject = function (memberName, object, source) {
        var returnData = {};
        if (!$this.isNull(source)) {
            $.extend(returnData, source);
        }
        $.each(object, function (name, value) {
            returnData[memberName + '.' + name] = value;
        });
        $.each(source, function (name, value) {
            returnData[memberName + '.' + name] = value;
        });
        return returnData;
    };
    //#endregion

    //#region wait - totalTimeout 시간안에 timeout 시간동안 func을 실행해서 true이면 resolve를 실행하고 시간이 초과되면 reject를 실행한다.
    this.wait = function (deferred, timeout, totalTimeout, func) {
        if (totalTimeout <= 0) {
            deferred.reject();
        } else {
            setTimeout(function () {
                if (func()) {
                    deferred.resolve();
                } else {
                    $this.wait(deferred, timeout, totalTimeout - timeout, func);
                }
            }, timeout);
        }
    };
    //#endregion

    //#region uploadSingleFile - 단일 파일 업로드
    /*
    BIT.uploadSingleFile(
        $파일컨트롤,
        '/Services/Common/UploadFiles.aspx?ModelType=Models.FileInfoModel',
        {
            Category: 'ProductImage',
            UserPid: 10
        },
            /(\.|\/)(png|jpe?g|gif)$/i,
            5000000,
        function (data, $selector) {
        });
    */
    this.uploadSingleFile = function ($selector, url, formData, acceptFileType, maxFileSize, callbackCompleted, callbackAdded) {
        if ($selector.length > 0) {
            for (let i = 0; i < $selector.length; i++) {
                $selector.eq(i).fileupload({
                    url: url,
                    dropZone: null,
                    formData: formData,
                    uploadTemplateId: null,
                    downloadTemplateId: null,
                    autoUpload: true,
                    disableValidation: false,
                    maxNumberOfFiles: 1,
                    acceptFileTypes: acceptFileType,
                    maxFileSize: maxFileSize,
                    minFileSize: 1,
                    messages: {
                        maxNumberOfFiles: BIT.messages.file_maxNumber,
                        acceptFileTypes: BIT.messages.file_denied,
                        maxFileSize: BIT.messages.file_toobig,
                        minFileSize: BIT.messages.file_toosmall
                    },
                    processfail: function (e, data) {
                        if (!BIT.isNull(data.files) && !BIT.isNull(data.files[0]) && !BIT.isNull(data.files[0].error)) {
                            $this.modal(data.files[0].error, $this.messages.common_error_title);
                        }
                    },
                    added: function (e, data) {
                        if (!BIT.isNullOrEmpty(callbackAdded)) {
                            callbackAdded(data.files[0]);
                        }
                    },
                    done: function (e, data) {
                        let response = data.result;
                        if (response.IsSucceed) {
                            if (!BIT.isNullOrEmpty(callbackCompleted)) {
                                if (typeof response.Data === 'string') {
                                    response.Data = decryptedResponseData(response.Data);
                                }
                                callbackCompleted($this.isNull(response.Data) || $this.isNull(response.Data.length) ? response.Data : response.Data[0], $(e.target));
                            }
                        } else {
                            $this.modal(response.Message);
                        }
                    }
                });
            }
        }
    };
    //#endregion


    //#region uploadMultiFiles
    /*
    var fileOptions = $('#fileupload').closest('div[id^=container]').data('options');
    BIT.uploadMultiFiles($container, {
        maxFileSize: BIT.isNull(fileOptions.data.maxFileSize) ? parseInt('<%= this.MaxLength %>') : fileOptions.data.maxFileSize,
        maxNumberOfFiles: parseInt(fileOptions.data.maxNumberOfFiles),
        acceptFileTypes: BIT.isNull(fileOptions.data.acceptFileTypes) ? new RegExp('') : typeof (fileOptions.data.acceptFileTypes) === 'string' ? new RegExp('(\.|\/)(' + unescape(fileOptions.data.acceptFileTypes) + ')$') : unescape(fileOptions.data.acceptFileTypes),
        formData: {
            Category: fileOptions.data.Category,
            ModelType: 'Web._Models.FileInfoModel'
        },
        downloadUrl: '/_Services/Common/FileDownload.aspx?FilePids=',
        deleteUrl: '/_Services/Common/RemoveFile.aspx?FilePids=',
        uploadRoot: '/_UploadFiles'
    }, function (data) {
        let response = data;
        if (!BIT.isNull(data.result)) {
            response = data.result;
        }

        if (!BIT.isNull(response.Data) && response.IsSucceed) {
            //do something
        } else if (!response.IsSucceed) {
            if (data.context) {
                $(data.context).find('.name').html(data.files[0].name);
                $(data.context).find('.size').html(BIT.formatFileSize(data.files[0].size));
                $(data.context).find('.error').html(response.Message);
            }
        }
    }, function (data) {
        //do something...
    }, function (data) {
        let filePids = '';
        $container.find('.files tr').each(function () {
            if (!BIT.isNull($(this).data('file')) && $(this).data('file') !== '') {
                filePids += $(this).data('file').FilePid + ',';
            }
        });
        if (filePids.length > 0) {
            $.cookie('filePids', filePids.substr(0, filePids.length - 1));
        }
    });
    */
    this.uploadMultiFiles = function ($form, options, callbackCompleted, callbackDetroyed, callbackFinished) {
        let def = {
            //#region General
            dropZone: $form,
            singleFileUploads: false,   /* 이 값이 false 이면 한꺼번에 선택한 파일들은 start 버튼이 하나만 보이고 한번에 업로드가 된다.*/
            limitMultiFileUploads: undefined,
            limitMultiFileUploadSize: undefined,
            autoUpload: false,
            formData: {},
            //#endregion

            uploadTemplateId: 'template-upload',
            downloadTemplateId: 'template-download',

            //#region validation
            disableValidation: false,
            maxNumberOfFiles: 10,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp)$/i,
            maxFileSize: 100000000,
            minFileSize: 1,
            //#endregion

            messages: {
                maxNumberOfFiles: BIT.messages.file_maxNumber,
                acceptFileTypes: BIT.messages.file_denied,
                maxFileSize: BIT.messages.file_toobig,
                minFileSize: BIT.messages.file_toosmall
            },
            downloadUrl: '/Services/Common/FileDownload.aspx?FilePids=',
            deleteUrl: '/Services/Common/RemoveFile.aspx?FilePids=',
            uploadRoot: '/_UploadFiles'
        };

        let opt = $.extend(def, options);
        function createFileObject(response) {
            if (response.IsSucceed) {
                let files = [];
                let data = response.Data;
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    let file = {
                        fileRef: item,
                        fileId: item.FilePid,
                        name: item.RealName,
                        url: opt.downloadUrl + item.FilePid,
                        size: parseInt(item.Size),
                        deleteType: 'post',
                        deleteUrl: opt.deleteUrl + item.FilePid
                    };
                    if (item.ThumbnailYN === 'Y') {
                        file.thumbnailUrl = opt.uploadRoot + '/Thumbnails/' + item.Category + '/' + item.VirtualName;
                    }
                    files.push(file);
                }
                return files;
            } else {
                return [];
            }
        }

        $form.fileupload({
            dropZone: opt.dropZone,
            singleFileUploads: opt.singleFileUploads,
            limitMultiFileUploads: opt.limitMultiFileUploads,
            limitMultiFileUploadSize: opt.limitMultiFileUploadSize,
            autoUpload: opt.autoUpload,
            formData: opt.formData,
            uploadTemplateId: opt.uploadTemplateId,
            downloadTemplateId: opt.downloadTemplateId,
            disableValidation: opt.disableValidation,
            maxNumberOfFiles: opt.maxNumberOfFiles,
            acceptFileTypes: opt.acceptFileTypes,
            maxFileSize: opt.maxFileSize,
            minFileSize: opt.minFileSize,
            messages: opt.messages,
            getFilesFromResponse: function (response) {
                if (!$this.isNull(response.result)) {
                    response = response.result;
                }
                if (typeof response.Data === 'string') {
                    response.Data = decryptedResponseData(response.Data);
                }
                return createFileObject(response);
            },
            destroyed: function (e, data) {
                if (!BIT.isNull(callbackDetroyed)) {
                    callbackDetroyed(data);
                }
            },
            destroyfailed: function (e, data) {
                let result = data;
                if (!$this.isNull(data.result)) {
                    result = data.result;
                }
                if (data.context) {
                    if (BIT.isNull(result.Message)) {
                        $(data.context).remove();
                    } else {
                        $(data.context).find('.error').html(result.Message);
                    }
                }
            },
            completed: function (e, data) {
                if (!BIT.isNull(callbackCompleted)) {
                    callbackCompleted(data);
                }
            },
            finished: function (e, data) {
                if (!BIT.isNull(callbackFinished)) {
                    callbackFinished(data);
                }
            }
        });
    };
    //#endregion


    //#region getRandomString - 임의의 문자열 생성
    this.getRandomString = function () {
        if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
    };
    //#endregion

    //#region calculateAge - 나이 계산
    this.calculateAge = function (text) {
        var birthday = $this.convertToDate(text);
        if (birthday === '') {
            return -1;
        }
        var today = new Date();
        var years = today.getFullYear() - birthday.getFullYear();
        birthday.setFullYear(today.getFullYear());

        if (today < birthday) {
            years--;
        }

        return years;
    };
    //#endregion
    //#endregion
}

this.BIT = new BitCommonClass();

if ($.fn.datepicker) {
    $.fn.datepicker.languages[cultureCode] = date_locale;
}

$(function () {
    $.ajaxSetup({
        cache: false
    });

    let selector = 'input:not(:disabled):not(:hidden):visible,select:visible,textarea:visible,button:visible,[id^=Editable_]:visible';
    $(document).on('keydown', selector, function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
        let $this = $(this);
        let currentIndex = 0;

        if (e.shiftKey && e.key === 'Tab') {
            $(selector).each(function (i) {
                if ($this.is($(this))) {
                    currentIndex = i;
                }
            });

            $(selector).each(function (i) {
                if (currentIndex - 1 === i) {
                    if ($(this).is('span[id^=Editable_]:visible')) {
                        $(this).trigger('click');
                        $(this).focus();
                    } else {
                        $(this).focus();
                    }
                }
            });
        } else if (e.key === 'Tab') {
            $(selector).each(function (i) {
                if ($this.is($(this))) {
                    currentIndex = i;
                }
            });

            $(selector).each(function (i) {
                if (currentIndex + 1 === i) {
                    $(this).focus();
                }
            });
        }
    });

    $('body').on('click', ':checkbox', function () {
        if ($(this)[0].checked && ($(this).val() === 'N' || $(this).val() === 'Y')) {
            $(this).val('Y');
        } else if (!$(this)[0].checked && ($(this).val() === 'N' || $(this).val() === 'Y')) {
            $(this).val('N');
        }
    });

    //#region 라디오 버튼 언체크
    $('body').on('click', ':radio', function () {
        var $this = $(this);
        if (!$this.is('.uncheck')) {
            return;
        }
        $(':radio[name="' + $(this).attr('name') + '"]').each(function () {
            if (!$(this).is($this)) {
                $(this).data('checked', false);
            } else {
                if (BIT.isNull($(this).data('checked'))) {
                    $(this).data('checked', false);
                }
            }
        });
        if ($(this)[0].checked) {
            if ($(this).data('checked')) {
                $(this)[0].checked = false;
                $(this).data('checked', false);
            } else {
                $(this).data('checked', true);
            }
        } else {
            $(this).data('checked', false);
        }
    });
    //#endregion


    //#region 키보드 입력 이벤트 함수
    // 점도 가능
    $('.float').css('ime-mode', 'disabled');
    $('body').on('keydown', '.float', function (event) {
        if (event.shiftKey || event.ctrlKey || event.altKey) {
            event.preventDefault();
        }
        // 숫자, 점, BS, Left, Right, Del, Tab
        if (event.keyCode && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)
            && event.keyCode !== 190 && event.keyCode !== 110
            && event.keyCode !== 189 && event.keyCode !== 109
            && event.keyCode !== 8
            && event.keyCode !== 37
            && event.keyCode !== 39
            && event.keyCode !== 46
            && event.keyCode !== 9) {
            event.preventDefault();
        }
    });

    // 숫자만 입력 가능하다..
    $('.uint').css('ime-mode', 'disabled');
    $('body').on('keydown', '.uint', function (event) {
        if (event.shiftKey || event.ctrlKey || event.altKey) {
            event.preventDefault();
        }
        // 숫자, BS, Left, Right, Del, Tab
        if (event.keyCode && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)
            && event.keyCode !== 8
            && event.keyCode !== 37
            && event.keyCode !== 39
            && event.keyCode !== 46
            && event.keyCode !== 9) {
            event.preventDefault();
        }
    });

    // 음수 가능
    $('.int').css('ime-mode', 'disabled');
    $('body').on('keydown', '.int', function (event) {
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

    // 영문 및 숫자만 입력 가능하다..
    $('.engnum').css('ime-mode', 'disabled');
    $('body').on('keydown', '.engnum', function (event) {
        if (event.shiftKey || event.ctrlKey || event.altKey) {
            event.preventDefault();
        }
        // 숫자, 영문, BS, Left, Right, Del, Tab
        if (event.keyCode && (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)
            && (event.keyCode < 65 || event.keyCode > 90) && (event.keyCode < 97 || event.keyCode > 122)
            && event.keyCode !== 8
            && event.keyCode !== 37
            && event.keyCode !== 39
            && event.keyCode !== 46
            && event.keyCode !== 9) {
            event.preventDefault();
        }
    });
    //#endregion
});