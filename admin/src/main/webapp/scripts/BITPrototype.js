(function () {

    //#region Date 형식 prototype
    Date.prototype.addMinutes = function (m) {
        this.setMinutes(this.getMinutes() + m);
        return this;
    };

    Date.prototype.addHours = function (h) {
        this.setHours(this.getHours() + h);
        return this;
    };

    // 날짜에 주어진 일자를 더합니다.
    // new Date().addDay(7);  => 7일 후
    Date.prototype.addDay = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setDate(targetDate.getDate() + val));
    };

    //날짜에 주어진 주를 더합니다.
    Date.prototype.addWeek = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setDate(targetDate.getDate() + val * 7));
    };

    //날짜에 주어진 개월을 더합니다.
    Date.prototype.addMonth = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setMonth(targetDate.getMonth() + val));
    };

    //날짜에 주어진 년을 더합니다.
    Date.prototype.addYear = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setFullYear(targetDate.getFullYear() + val));
    };

    // 날짜에 주어진 일자를 뺍니다.
    // new Date().minusDay(7);  => 7일 전
    Date.prototype.minusDay = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setDate(targetDate.getDate() - val));
    };

    //날짜에 주어진 주를 뺍니다.
    Date.prototype.minusWeek = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setDate(targetDate.getDate() - val * 7));
    };

    //날짜에 주어진 개월을 뺍니다.
    Date.prototype.minusMonth = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setMonth(targetDate.getMonth() - val));
    };

    //날짜에 주어진 년을 뺍니다.
    Date.prototype.minusYear = function (val) {
        var date = this;
        var targetDate = new Date(date.toString('d'));
        return new Date(targetDate.setFullYear(targetDate.getFullYear() - val));
    };

    //Date개체를 해당 포맷의 문자열로 변환합니다.
    Date.prototype.toString = function (format) {
        if (BIT.isNull(format)) {
            return $.customFormat.date(this);
        } else if (format.length > 1) {
            return $.customFormat.date(this, format);
        } else {
            switch (format.toLowerCase()) {
                case 'd': {
                    return $.customFormat.date(this, BIT.messages.dateFormat_d);
                }
                case 't': {
                    return $.customFormat.date(this, BIT.messages.dateFormat_t);
                }
                case 'g': {
                    return $.customFormat.date(this, BIT.messages.dateFormat_g);
                }
                case 's': {
                    return $.customFormat.date(this, BIT.messages.dateFormat_s);
                }
                case 'm': {
                    return $.customFormat.date(this, BIT.messages.dateFormat_m);
                }
                default: {
                    $this.modal(format + '은 인식 할 수 없는 Date 포맷입니다.', 'error');
                }
            }
        }
    };
    //#endregion

    //#region  String 형식 prototype
    //문자열을 Date 개체로 변환 합니다.
    String.prototype.convertToDate = function () {
        return BIT.convertToDate(this.toString());
    };

    // 'ㅁㅁㅁㅁ'.padLeft(5)  => " ㅁㅁㅁㅁ"
    String.prototype.padLeft = function (totalWidth, paddingChar) {
        return Array(totalWidth - this.length + 1).join(paddingChar || " ") + this;
    };

    // 'ㅁㅁㅁㅁ'.padRight(5)  => "ㅁㅁㅁㅁ "
    String.prototype.padRight = function (totalWidth, paddingChar) {
        return this + Array(totalWidth - this.length + 1).join(paddingChar || " ");
    };

    //긴 문자열을 ... 으로..
    // class ="ellipsis" 를 사용하십시오.
    String.prototype.trimToLength = function (m) {
        if (this.length > m) {
            return jQuery.trim(this).substring(0, m) + "...";
        } else {
            return this;
        }
    };

    //queryString을 json 형식의 object로 변환합니다.
    // name=hong&id=abc => {name :'hong', id:'abc'}
    String.prototype.queryStringToJSON = function () {
        let href = this;
        let qStr = href.replace(/(.*?\?)/, '');
        let qArr = decodeURI(qStr).split('&');
        let stack = {};
        for (let i = 0; i < qArr.length; i++) {
            let a = qArr[i].split('=');
            let name = a[0], value = $.isNumeric(a[1]) ? parseFloat(a[1]) : BIT.isNullOrEmpty(a[1]) ? '' : a[1];
            if (name === '') {
                continue;
            }
            if (name.match(/(.*?)\[(.*?)]/)) {
                name = RegExp.$1;
                let name2 = RegExp.$2;
                if (name2) {
                    if (!(name in stack)) {
                        stack[name] = {};
                    }
                    stack[name][name2] = value;
                } else {
                    if (!(name in stack)) {
                        stack[name] = [];
                    }
                    stack[name].push(value);
                }
            } else {
                stack[name] = $.trim(decodeURIComponent(value));
            }
        }
        return stack;
    };
    //#endregion

    if (!Array.prototype.remove) {

        Array.prototype.remove = function () {

            let length = this.length;

            if (typeof arguments[0] === 'function') {
                for (var i = length - 1; i >= 0; i--) {
                    if (arguments[0].call(this, this[i])) {
                        this.splice(i, 1);
                    }
                }
            } else {
                for (i = length - 1; i >= 0; i--) {
                    for (var j = 0; j < arguments.length; j++) {
                        if (this[i] === arguments[j]) {
                            this.splice(i, 1);
                        }
                    }
                }
            }

            return this.length;
        };
    }

    if (!Array.prototype.removeAt) {
        Array.prototype.removeAt = function (index) {

            this.splice(index, 1);
            return this.length;
        };
    }

    if (!Array.prototype.contains) {
        Array.prototype.contains = function () {
            let length = this.length;
            if (arguments.length !== 1) {
                throw new Exception('argument의 갯수는 1이어야 합니다.');
            }
            if (typeof arguments[0] === 'function') {
                for (var i = 0; i < length; i++) {
                    if (arguments[0].call(this, this[i])) {
                        return true;
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (this[i] === arguments[0]) {
                        return true;
                    }
                }
            }
            return false;
        };
    }

    if (!Array.prototype.find) {
        Array.prototype.find = function () {
            let length = this.length;
            if (arguments.length !== 1) {
                throw new Exception('argument의 갯수는 1이어야 합니다.');
            }
            if (typeof arguments[0] === 'function') {
                for (var i = 0; i < length; i++) {
                    if (arguments[0].call(this, this[i])) {
                        return this[i];
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (this[i] === arguments[0]) {
                        return this[i];
                    }
                }
            }
            return null;
        };
    }

    if (!Array.prototype.findAll) {
        Array.prototype.findAll = function () {
            let length = this.length;
            let arr = [];

            if (arguments.length !== 1) {
                throw new Exception('argument의 갯수는 1이어야 합니다.');
            }

            if (typeof arguments[0] === 'function') {
                for (var i = 0; i < length; i++) {
                    if (arguments[0].call(this, this[i])) {
                        arr.push(this[i]);
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (this[i] === arguments[0]) {
                        arr.push(this[i]);
                    }
                }
            }
            return arr;
        };
    }

    if (!Array.prototype.sum) {
        Array.prototype.sum = function (func) {
            let length = this.length;
            let num = 0;

            if (typeof func === 'function') {
                for (var i = 0; i < length; i++) {
                    num += func.call(this, this[i]);
                }
            } else {
                throw new Exception('argument는 함수여야 합니다.');
            }
            return num;
        };
    }

    if (!Number.isNaN) {
        Number.isNaN = function (n) {
            return typeof n === 'number' && window.isNaN(n);
        };
    }

    // Production steps of ECMA-262, Edition 6, 22.1.2.1
    // Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
    if (!Array.from) {
        Array.from = (function () {
            var toStr = Object.prototype.toString;
            var isCallable = function (fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function (value) {
                var number = Number(value);
                if (isNaN(number)) { return 0; }
                if (number === 0 || !isFinite(number)) { return number; }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function (value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

            // The length property of the from method is 1.
            return function from(arrayLike/*, mapFn, thisArg */) {
                // 1. Let C be the this value.
                var C = this;

                // 2. Let items be ToObject(arrayLike).
                var items = Object(arrayLike);

                // 3. ReturnIfAbrupt(items).
                if (BIT.isNull(arrayLike)) {
                    throw new TypeError("Array.from requires an array-like object - not null or undefined");
                }

                // 4. If mapfn is undefined, then let mapping be false.
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    // 5. else      
                    // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }

                    // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }

                // 10. Let lenValue be Get(items, "length").
                // 11. Let len be ToLength(lenValue).
                var len = toLength(items.length);

                // 13. If IsConstructor(C) is true, then
                // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
                // 14. a. Else, Let A be ArrayCreate(len).
                var A = isCallable(C) ? Object(new C(len)) : new Array(len);

                // 16. Let k be 0.
                var k = 0;
                // 17. Repeat, while k < len… (also steps a - h)
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                // 18. Let putStatus be Put(A, "length", len, true).
                A.length = len;
                // 20. Return A.
                return A;
            };
        }());
    }

})();