/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: en (English; 영어)
 * https://github.com/jquery/jquery-ui/tree/master/ui/i18n
 */
var cultureCode = 'pt';

var messages_locale = {
    file_denied: 'Tipo de arquivo não permitido.',
    file_duplicate: '{0} arquivo(s) está(ão) selecionado(s).',
    file_toobig: 'O arquivo é muito grande.',
    file_toosmall: 'O arquivo é muito pequeno.',
    file_maxNumber: 'Número máximo de arquivos excedidos.',
    file_notfoundimage: 'Arquivo de imagem não encontrado.',
    common_info_title: 'Informações',
    common_error_title: 'Erro',
    common_confirm_title: 'Confirmar',
    common_search_title: 'Pesquisar',
    common_modal_close: 'Fechar',
    common_modal_apply: 'Aplicar',
    common_modal_save: 'Salvar',
    common_file_title: 'Arquivo',
    common_server_error: 'Erro disparado do servidor.',
    common_validator_hidden_element: '{0} elemento(s) está(ão) oculto(s).',
    common_validator_notfound_element: '{0} Elemento(s) não pode(m) ser encontrado(s).',
    common_invalid_request: 'Pedido inválido.',
    common_has_not_permission: 'Você não tem permissão.',
    common_loading: 'Loading data...',
    common_wait: 'Please wait.',
    datepicker_next_year: 'Próximo ano',
    datepicker_prev_year: 'Ano anterior',
    dateFormat_d: 'dd/MM/yyyy',
    dateFormat_t: 'HH:mm',
    dateFormat_g: 'dd/MM/yyyy HH:mm',
    dateFormat_s: 'dd/MM/yyyy HH:mm:ss',
    dateFormat_m: 'MM/yyyy',
    gateway_cannotconect: 'Não é possível conectar ao gateway.',
    common_modal_button_text: 'Confirmar',
    common_confirm_button_confirm_title: 'Confirmar',
    common_confirm_button_cancel_title: 'Cancelar'
};

var date_locale = {
    format: 'dd/MM/yyyy',
    days: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    daysMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
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
    monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    buttonText: {
        prev: '<input type="button" title="previous" class="btn_prev margin_t3" />',
        next: '<input type="button" title="next" class="btn_next margin_t3" />',
        prevYear: '<input type="button" title="first" class=" btn_first margin_t3" />',
        nextYear: '<input type="button" title="last" class="btn_last margin_t3" />',
        today: 'Hoje',
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