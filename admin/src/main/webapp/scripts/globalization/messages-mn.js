/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: en (English; 영어)
 * https://github.com/jquery/jquery-ui/tree/master/ui/i18n
 */
var cultureCode = 'mn';

var messages_locale = {
    file_denied: 'Зөвшөөрөгдөөгүй хэлбэрийн файл байна.',
    file_duplicate: '{0} файл сонгогдсон байна.',
    file_toobig: 'Зөвшөөрөгдсөн хэмжээнээс хэт том файл байна.',
    file_toosmall: 'Хязгаарласан хэмжээнээс хэт жижиг файл байна.',
    file_maxNumber: 'Файлын тоо зөвшөөрсөн хязгаараас хэтэрсэн байна.	',
    file_notfoundimage: 'Зурган файлыг олж чадсангүй.',
    common_info_title: 'Мэдээлэл',
    common_error_title: 'Алдаа',
    common_confirm_title: 'Зөвшөөрөх',
    common_search_title: 'Хайлт хийх',
    common_modal_close: 'Хаах',
    common_modal_apply: 'Тохируулах',
    common_modal_save: 'Хадгалах',
    common_file_title: 'Файл ',
    common_server_error: 'Сервер системд алдаа илэрлээ.',
    common_validator_hidden_element: '{0} Элемент нуугдмал байдалтай байна.',
    common_validator_notfound_element: '	{0} Элемент олдсонгүй.',
    common_invalid_request: 'Хүчин төгөлдөр бус хүсэлт байна	',
    common_has_not_permission: 'Нэвтрэх эрхгүй байна.',
    common_loading: 'Loading data...',
    common_wait: 'Please wait.',
    datepicker_next_year: 'Дараа жил',
    datepicker_prev_year: 'Урьд жил',
    dateFormat_d: 'yyyy.MM.dd',
    dateFormat_t: 'HH:mm',
    dateFormat_g: 'yyyy.MM.dd HH:mm	',
    dateFormat_s: 'yyyy.MM.dd HH:mm:ss',
    dateFormat_m: 'yyyy.MM	',
    gateway_cannotconect: 'Gateway-д холбогдох боломжгүй байна.',
    common_modal_button_text: 'Зөвшөөрөх',
    common_confirm_button_confirm_title: 'Зөвшөөрөх',
    common_confirm_button_cancel_title: 'Цуцлах'
};


var date_locale = {
    format: 'yyyy.MM.dd',
    days: ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'],
    daysShort: ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'],
    daysMin: ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'],
    months: ['1Нэгдүгээр сар', 'Хоёрдугаар сар', 'Гуравдугаар сар', 'Дөрөвдүгээр сар', 'Тавдугаар сар', 'Зургадугаар сар', 'Долдугаар сар', 'Наймдугаар сар', 'Есдүгээр сар', 'Аравдугаар сар', 'Арван нэгдүгээр сар', 'Арван хоёрдугаар '],
    monthsShort: ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'],
    weekStart: 0,
    yearFirst: true,
    yearSuffix: 'сар',
    am:'AM',
    pm:'PM'
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
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    buttonText: {
        prev: '<input type="button" title="previous" class="btn_prev margin_t3" />',
        next: '<input type="button" title="next" class="btn_next margin_t3" />',
        prevYear: '<input type="button" title="first" class=" btn_first margin_t3" />',
        nextYear: '<input type="button" title="last" class="btn_last margin_t3" />',
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day'
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