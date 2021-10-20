/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: KO (Korean; 한국어)
 * https://github.com/jquery/jquery-ui/tree/master/ui/i18n
 */
var cultureCode = 'ko';

var messages_locale = {
    file_denied: '허용되지 않는 파일입니다.',
    file_duplicate: '{0} 파일은 이미 선택되어져 있습니다.',
    file_toobig: '허용된 파일 크기 보다 너무 큽니다.',
    file_toosmall: '제한된 파일 크기 보다 너무 작습니다.',
    file_maxNumber: '파일 수가 최대 허용수에 도달했습니다.',
    file_notfoundimage: '이미지 파일을 찾을 수 없습니다.',
    common_info_title: '알림',
    common_error_title: '오류',
    common_confirm_title: '확인',
    common_search_title: '검색',
    common_modal_close: '닫기',
    common_modal_apply: '적용',
    common_modal_save: '저장',
    common_file_title: '파일',
    common_server_error: '서버 시스템에 오류가 발생하였습니다.',
    common_validator_hidden_element: '{0} 요소가 Hidden 상태입니다.',
    common_validator_notfound_element: '{0} 요소를 찾을 수 없습니다.',
    common_invalid_request: '정상적이지 않은 요청입니다.',
    common_has_not_permission: '권한이 없습니다.',
    common_loading: '데이터를 불러오는 중입니다.',
    common_wait: '잠시만 기다려주시기 바랍니다.',
    datepicker_next_year: '다음해',
    datepicker_prev_year: '이전해',
    dateFormat_d: 'yyyy-MM-dd',
    dateFormat_t: 'HH:mm',
    dateFormat_g: 'yyyy-MM-dd HH:mm',
    dateFormat_s: 'yyyy-MM-dd HH:mm:ss',
    dateFormat_m: 'yyyy-MM',
    gateway_cannotconect: '게이트웨이에 연결 할 수 없습니다.',
    common_modal_button_text: '확인',
    common_confirm_button_confirm_title: '확인',
    common_confirm_button_cancel_title: '취소'

};

var date_locale = {
    format: 'yyyy-MM-dd',
    days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    daysShort: ['일', '월', '화', '수', '목', '금', '토'],
    daysMin: ['일', '월', '화', '수', '목', '금', '토'],
    months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    weekStart: 0,
    yearFirst: true,
    yearSuffix: '년',
    am:'오전',
    pm:'오후'
};

var calendarOption = {

    // display
    defaultView: 'month',
    aspectRatio: 1.35,
    header: {
        left: 'title',
        center: '',
        right: 'prevYear,prev today next,nextYear'
    },
    weekends: true,
    weekNumbers: false,
    weekNumberCalculation: 'iso',
    weekNumberTitle: 'W',

    // editing
    editable: false,
    disableDragging: true,
    disableResizing: true,

    allDayDefault: true,
    ignoreTimezone: true,

    // event ajax
    lazyFetching: true,
    startParam: 'start',
    endParam: 'end',

    // time formats
    titleFormat: {
        month: ' yyyy년 MMMM',
        week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",
        day: 'dddd, MMM d, yyyy'
    },
    columnFormat: {
        month: 'ddd',
        week: 'MM월 dd일 ddd',
        day: 'MM월 dd일 dddd'
    },
    timeFormat: { // for event elements
        '': 'H(:mm)t' // default
    },

    // locale
    isRTL: false,
    firstDay: 0,
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    buttonText: {
        prev: '<input type="button" title="previous" class="btn_prev margin_t3" />',
        next: '<input type="button" title="next" class="btn_next margin_t3" />',
        prevYear: '<input type="button" title="first" class=" btn_first margin_t3" />',
        nextYear: '<input type="button" title="last" class="btn_last margin_t3" />',
        today: '오늘',
        month: '월',
        week: '주',
        day: '일'
    },

    // jquery-ui theming
    theme: false,
    buttonIcons: {
        prev: 'circle-triangle-w',
        next: 'circle-triangle-e'
    },

    //selectable: false,
    unselectAuto: true,

    dropAccept: '*',

    handleWindowResize: true,
    defaultEventMinutes: 30

};