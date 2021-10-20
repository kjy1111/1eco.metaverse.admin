/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: en (English; 영어)
 * https://github.com/jquery/jquery-ui/tree/master/ui/i18n
 */
var cultureCode = 'en';

var messages_locale = {
    file_denied: 'File type not allowed.',
    file_duplicate: '{0} file is selected.',
    file_toobig: 'File is too large.',
    file_toosmall: 'File is too small.',
    file_maxNumber: 'Maximum number of files exceeded.',
    file_notfoundimage: 'Not found image file.',
    common_info_title: 'Info',
    common_error_title: 'Error',
    common_confirm_title: 'Confirm',
    common_search_title: 'Search',
    common_modal_close: 'Close',
    common_modal_apply: 'Apply',
    common_modal_save: 'Save',
    common_file_title: 'File',
    common_server_error: 'fired error from server.',
    common_validator_hidden_element: '{0} element is hidden.',
    common_validator_notfound_element: '{0} element can not found.',
    common_invalid_request: 'invalid request.',
    common_has_not_permission: 'You do not have permission.',
    common_loading: 'Loading data...',
    common_wait: 'Please wait.',
    datepicker_next_year: 'Next Year',
    datepicker_prev_year: 'Prev Year',
    dateFormat_d: 'MM/dd/yyyy',
    dateFormat_t: 'HH:mm',
    dateFormat_g: 'MM/dd/yyyy HH:mm',
    dateFormat_s: 'MM/dd/yyyy HH:mm:ss',
    dateFormat_m: 'MM/yyyy',
    gateway_cannotconect: 'Can not connect to Gateway.',
    common_modal_button_text: 'Confirm',
    common_confirm_button_confirm_title: 'Confirm',
    common_confirm_button_cancel_title: 'Cancel'

};

var date_locale = {
    format: 'MM/dd/yyyy',
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    weekStart: 0,
    yearFirst: false,
    yearSuffix: '',
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