/**
 * jQuery Editable Select
 * Indri Muska <indrimuska@gmail.com>
 *
 * Source on GitHub @ https://github.com/indrimuska/jquery-editable-select
 * 2017-09-21 수정
 */

(function ($) {
    $.extend($.expr[':'], {
        nic: function (elem, i, match, array) {
            return !((elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0);
        }
    });

    var originalVal = $.fn.val;
    $.fn.val = function () {
        var result;
        if ($(this).is(':hidden') && arguments.length > 0 && $(this).data('timeId') != null && $('[name=' + $(this).attr('name') + '_' + $(this).data('timeId') + ']').is('.es-input')) {
            if ($(this)[0].value != arguments[0]) {
                $(this).setValue(arguments[0]);
                result = originalVal.apply(this, []);
            } else {
                result = originalVal.apply(this, arguments);
            }
        } else {
            result = originalVal.apply(this, arguments);
        }
        return result;
    };

    var originalAttr = $.fn.attr;
    $.fn.attr = function () {
        var result;
        if ($(this).is(':hidden') && arguments.length > 0 && $(this).data('timeId') != null && $('[name=' + $(this)[0].name + '_' + $(this).data('timeId') + ']').is('.es-input')) {
            if ('disabled' == arguments[0]) {
                $(this).data('disabled', arguments[1]);
            } else {
                result = originalAttr.apply(this, arguments);
            }
        } else {
            result = originalAttr.apply(this, arguments);
        }
        return result;
    };

    var originalEmpty = $.fn.empty;
    $.fn.empty = function () {
        var result;
        if ($(this).is(':hidden') && $(this).data('timeId') != null && $('[name=' + $(this).attr('name') + '_' + $(this).data('timeId') + ']').is('.es-input')) {
            if ($('[name=' + $(this).attr('name') + '_' + $(this).data('timeId') + ']').is('span')) {
                $(this).html('');
            } else {
                $(this)[0].value = '';
            }
            var d = $(this).attr('id').split('_')[2];
            $('#Editable_ul_' + d).empty();
            result = $(this);
        } else {
            result = originalEmpty.apply(this, arguments);
        }
        return result;
    };

    var originalAppend = $.fn.append;
    $.fn.append = function () {
        var result;
        if ($(this).is(':hidden') && arguments.length > 0 && $(this).data('timeId') != null && $('[name=' + $(this).attr('name') + '_' + $(this).data('timeId') + ']').is('.es-input')) {
            var $opt = $(arguments[0]);
            var $li = $('<li />');
            $li.html('<p class="sel_p">' + $opt.html() + '</p>').data('value', $opt.attr('value')) ;
            if ($opt.attr('focused') != null) {
                var d = $(this).attr('id').split('_')[2];
                $('#Editable_ul_' + d + ' li.focused').removeClass('focused');
                $li.addClass('focused');
            }

            var d = $(this).attr('id').split('_')[2];
            if ($('#Editable_ul_' + d).children().length == 0 || $('#Editable_ul_' + d + ' li.focused').length == 0) {
                $li.addClass('focused');
            }
            if ($li.is('.focused')) {
                if ($(this).data('esObject').options.editable) {
                    $(this).parent().find('[name=' + $(this).attr('name') + '_' + $(this).data('timeId') + ']').val($opt.html());
                } else {
                    $(this).parent().find('[name=' + $(this).attr('name') + '_' + $(this).data('timeId') + ']').html($opt.html());
                }
                $(this)[0].value = $opt.attr('value');
            }
            var d = $(this).attr('id').split('_')[2];
            result = $('#Editable_ul_' + d).append($li);
            $(this).initializeEvents();
        } else {
            result = originalAppend.apply(this, arguments);
        }
        return result;
    };

    $.extend($.fn, {
        initializeEvents: function () {
            var es = this.editableSelect();
            es.initializeList();
            es.initializeEvents();
        },
        setValue: function (value) {
            return this.editableSelect().setField(value);
        },
        editableSelect: function (options) {
            if (this.length == 0) {
                return;
            }
            var defaults = { filter: true, checkbox: false, direction: 'bottom', effect: 'default', duration: 'fast', onCreate: null, onShow: null, onHide: null, onSelect: null, editable: false };
            if ($(this).attr('class') != null && $(this).attr('class').indexOf('editable') >= 0) {
                defaults.editable = true;
            }
            if ($(this).attr('class') != null && $(this).attr('class').indexOf('checkbox') >= 0) {
                defaults.checkbox = true;
            }
            if ($(this).attr('class') != null && $(this).attr('class').indexOf('top') >= 0) {
                defaults.direction = 'top';
            }
            options = $.extend({}, defaults, options);

            var esObject = $.data(this[0], "esObject");
            if (esObject) {
                return esObject;
            }
            if (!this.is('select')) {
                return;
            }

            var timeId = 'EditableSelect';
            var dt = new Date().getTime().toString();
            var select = this.clone();
            var list = $('<ul class="es-list " id="Editable_ul_' + dt + '" style="width:' + select.width() + 'px; position:absolute;">');
            if (select.css('max-height') != 'none') {
                list.css('max-height', select.css('max-height'));
            }
            var $visibleElement = options.editable ? $('<input id="Editable_input_' + dt + '" type="text">') : $('<span id="Editable_span_' + dt + '"></span>');
            var $hidden = $('<input type="hidden" id="Editable_hidden_' + dt + '" name="' + select.attr('name') + '">');

            switch (options.effects) {
                case 'default': case 'fade': case 'slide': break;
                default: options.effects = 'default';
            }
            if (isNaN(options.duration) || options.duration != 'fast' || options.duration != 'slow') options.duration = 'fast';
            this.replaceWith($visibleElement);
            esObject = {
                init: function () {
                    var es = this;
                    es.copyAttributes(select, $visibleElement);
                    $visibleElement.addClass('es-input sel_bg');
                    if ($visibleElement.attr('name') != null && $visibleElement.attr('name') != '') {
                        $visibleElement.attr('name', select.attr('name') + '_' + timeId);
                    }

                    $.each(select.data(), function (key, value) {
                        $hidden.attr('data-' + key, value);
                    });
                    $visibleElement.after($hidden);

                    $('body').prepend(list);
                    var isSelected = false;
                    select.find('option').each(function () {
                        var li = $('<li>'), option = $(this);
                        li.data('value', option.val());
                        li.html('<p class="sel_p">' + option.text() + '</p>');
                        list.append(li);
                        if (options.checkbox && option.val() != "") {
                            li.prepend('<input class="c_chk" type="checkbox"/>');
                        }
                        if ($(this).is(':selected')) {
                            if (!options.editable) {
                                $visibleElement.html(option.text());
                                $hidden.val(option.val());
                                isSelected = true;
                            }
                        }
                    });

                    if (!isSelected) {
                        if (options.editable) {
                            $visibleElement.val('');
                            $hidden.val('');
                        } else {
                            $visibleElement.html(select.find('option:eq(0)').text());
                            $hidden.val(select.val());
                        }
                    }
                    if (options.editable) {
                        $visibleElement.on('focus input', function (e) {
                            if ($(this).attr('disabled') != null && ($(this).attr('disabled') == 'disabled' || $(this).attr('disabled') == 'true')) {
                                return;
                            }
                            if ($hidden.data('disabled') != true && $hidden.data('disabled') != 'disabled' && list.find('li:visible').length == 0) {
                                es.show();
                            }
                        });
                    }
                    $visibleElement.on('click', function (e) {
                        if ($(this).attr('disabled') != null && ($(this).attr('disabled') == 'disabled' || $(this).attr('disabled') == 'true')) {
                            return;
                        }
                        if ($hidden.data('disabled') != true && $hidden.data('disabled') != 'disabled' && list.find('li:visible').length == 0) {
                            es.show();
                        } else {
                            es.hide();
                        }
                    });
                    $(document).on('click', function (event) {
                        if (!$(event.target).is($visibleElement) && list.has($(event.target)).length == 0) {
                            es.hide();
                        }
                    });
                    es.initializeList();
                    es.initializeEvents();
                    if (options.onCreate) options.onCreate.call(this, $visibleElement);
                },
                initializeList: function () {
                    var es = this;
                    list.find('li').each(function () {
                        $(this).unbind('mousemove').on('mousemove', function () {
                            list.find('.focused').removeClass('focused');
                            $(this).addClass('focused');
                        });
                        $(this).unbind('click').on('click', function (e) {
                            es.setField.call(this, es);
                        });
                    });
                    list.unbind('mouseenter').on('mouseenter', function () {
                        list.find('li.focused').removeClass('focused');
                    });
                },
                initializeEvents: function () {
                    var es = this;
                    $visibleElement.unbind('focusout').bind('focusout', function (e) {
                        if ($(this).val() != '' && options.editable && $(this).val() != $visibleElement.data('value')) {
                            var li = $('<li>');
                            es.copyAttributes(list.find('li:first'), li);
                            li.data('value', $(this).val()).attr('value', $(this).val());
                            li.removeClass('focused').addClass('focused').show();
                            li.html('<p class="sel_p">' + $(this).val() + '</p>');
                            list.append(li);
                            $visibleElement.data('value', $(this).val());
                            $hidden.val($(this).val());
                            es.setField.call(list.find('li.focused'), $(this).val());
                            es.initializeList();
                        }
                    });

                    $visibleElement.unbind('input keydown').bind('input keydown', function (event) {
                        switch (event.keyCode) {
                            case 40: // Down
                                es.show();
                                var visibles = list.find('li:visible'), focused = visibles.filter('li.focused');
                                list.find('.focused').removeClass('focused');
                                focused = visibles.eq(focused.size() > 0 ? visibles.index(focused) + 1 : 0);
                                focused = (focused.size() > 0 ? focused : list.find('li:visible:first')).addClass('focused');
                                es.scroll(focused, true);
                                break;
                            case 38: // Up
                                es.show();
                                var visibles = list.find('li:visible'), focused = visibles.filter('li.focused');
                                list.find('li.focused').removeClass('focused');
                                focused = visibles.eq(focused.size() > 0 ? visibles.index(focused) - 1 : -1);
                                (focused.size() > 0 ? focused : list.find('li:visible:last')).addClass('focused');
                                es.scroll(focused, false);
                                break;
                            case 13: // Enter
                                if (list.is(':visible')) {
                                    if (list.find('li.focused').length > 0) {
                                        es.setField.call(list.find('li.focused'), es);
                                    }
                                    event.preventDefault();
                                } else {
                                    if ($(this).val() != '' && options.editable) {
                                        var li = $('<li>');
                                        es.copyAttributes(list.find('li:first'), li);
                                        li.data('value', $(this).val()).attr('value', $(this).val());
                                        li.removeClass('focused').addClass('focused').show();
                                        li.html('<p class="sel_p">' + $(this).val() + '</p>');
                                        list.append(li);
                                        $visibleElement.data('value', $(this).val());
                                        $hidden.val($(this).val());
                                        es.setField.call(list.find('li.focused'), $(this).val());
                                        es.initializeList();
                                    }
                                }
                            case 9:  // Tab
                            case 27: // Esc
                                es.hide();
                                break;
                            default:
                                es.show();
                                break;
                        }
                    });
                },
                show: function () {
                    list.find('li').show();
                    var hidden = options.editable && options.filter ? list.find('li:nic(' + $visibleElement.val() + ')').hide().size() : 0;
                    if (hidden == list.find('li').size()) list.hide();
                    else {
                        switch (options.effects) {
                            case 'fade': list.fadeIn(options.duration); break;
                            case 'slide': list.slideDown(options.duration); break;
                            default: list.show(options.duration); break;
                        }
                    }
                    var startPoint = $visibleElement.offset().top + $visibleElement.outerHeight();
                    var height = Math.min(list.find('li').outerHeight() * list.find('li').size(), list.css('max-height').substring(0, list.css('max-height').length - 2))
                    if ($('body').height() > height && $('body').height() < startPoint + height) {
                        options.direction = 'top';
                    }
                    if (options.direction == 'top') {
                        list.css({ top: $visibleElement.offset().top + 1 - height, left: $visibleElement.offset().left, width: $visibleElement.outerWidth() });
                    } else {
                        list.css({ top: $visibleElement.offset().top + $visibleElement.outerHeight(), left: $visibleElement.offset().left, width: $visibleElement.outerWidth() });
                    }
                    $visibleElement.removeClass('sel_bg').addClass('sel_bg_on');
                    if (options.onShow) options.onShow.call(this, $visibleElement);
                },
                hide: function () {
                    switch (options.effects) {
                        case 'fade': list.fadeOut(options.duration); break;
                        case 'slide': list.slideUp(options.duration); break;
                        default: list.hide(options.duration); break;
                    }
                    $visibleElement.removeClass('sel_bg_on').addClass('sel_bg');
                    if (options.onHide) options.onHide.call(this, $visibleElement);
                },
                scroll: function (focused, up) {
                    var height = 0, index = list.find('li:visible').index(focused);
                    list.find('li:visible').each(function (i, element) { if (i < index) height += $(element).outerHeight(); });
                    if (height + focused.outerHeight() >= list.scrollTop() + list.outerHeight() || height <= list.scrollTop()) {
                        if (up) list.scrollTop(height + focused.outerHeight() - list.outerHeight());
                        else list.scrollTop(height);
                    }
                },
                copyAttributes: function (from, to) {
                    var attrs = $(from)[0].attributes;
                    for (var i in attrs) {
                        if (attrs[i].nodeName != null && attrs[i].nodeName.indexOf('data-') < 0) {
                            $(to).attr(attrs[i].nodeName, attrs[i].nodeValue);
                        }
                    }
                    $(to).data($(from).data());
                },
                setField: function (es) {
                    if (options.editable) {
                        if (!$(this).is('li:visible') && typeof (es) == 'string') {
                            var exists = false;
                            list.find('li').removeAttr('class');
                            list.find('li').each(function () {
                                if ($(this).text() == es) {
                                    exists = true;
                                    $visibleElement.data('value', es)[0].value = $(this).text();
                                    $(this).addClass('focused');
                                    if ($hidden[0].value != $(this).text()) {
                                        $hidden[0].value = $(this).text();
                                        if ($hidden[0].value != '') {
                                            $hidden.trigger('change');
                                        }
                                    }
                                }
                            });
                            if (!exists) {
                                $hidden.append('<option value="' + es + '">' + es + '</option>');
                                $hidden.trigger('change');
                            }
                        } else {
                            $visibleElement.data('value', $(this).data('value'))[0].value = $(this).text();
                            if ($hidden[0].value != $(this).text()) {
                                $hidden[0].value = $(this).text();
                                $hidden.trigger('change');
                            }
                            es.hide();
                        }
                        if (options.onSelect) options.onSelect.call($visibleElement, $(this));
                    } else {  // editable 이 아닌 경우
                        if (!$(this).is('li:visible')) {    // 리스트모드의 값 입력
                            if (options.checkbox) {
                                var arr = es.split(',');
                                var txt = '';
                                var val = '';

                                list.find(':checked').prop('checked', false);
                                list.find('li').removeClass('selected').each(function () {
                                    for (var i = 0; i < arr.length; i++) {
                                        if ($(this).data('value') == arr[i]) {
                                            txt += $(this).text() + ','
                                            val += $(this).data('value') + ','
                                            if ($(this).find(':checkbox').length > 0) {
                                                $(this).find(':checkbox')[0].checked = true;
                                                $(this).addClass('selected');
                                            }
                                        }
                                    }
                                });

                                $visibleElement.html(txt.substring(0, txt.length - 1));
                                $hidden[0].value = val.substring(0, val.length - 1);
                            } else {
                                list.find('li').each(function () {
                                    if ($(this).data('value') == es) {
                                        $visibleElement.html($(this).text());
                                        if ($hidden[0].value != $(this).data('value')) {
                                            $hidden[0].value = $(this).data('value');
                                            if ($hidden[0].value != '') {
                                                $hidden.trigger('change');
                                            }
                                        }
                                    }
                                });
                            }
                        } else { // 리스트모드 사용자의 선택(클릭)
                            if (options.checkbox) {
                                if ($(this).data('value') != "") {
                                    if ($(this).is('.selected')) {
                                        $(this).removeClass('selected');
                                        $(this).find(':checkbox')[0].checked = false;
                                    } else {
                                        $(this).addClass('selected');
                                        $(this).find(':checkbox')[0].checked = true;
                                    }

                                    var txt = '';
                                    var val = '';
                                    list.find(':checked').each(function () {
                                        txt += $(this).closest('li').text() + ','
                                        val += $(this).closest('li').data('value') + ','
                                    });
                                    $visibleElement.html(txt.substring(0, txt.length - 1));
                                    $hidden[0].value = val.substring(0, val.length - 1);
                                } else {
                                    $visibleElement.html($(this).text());
                                    if ($hidden[0].value != $(this).data('value')) {
                                        $hidden[0].value = $(this).data('value');
                                        $hidden.trigger('change');
                                    }

                                    list.find(':checked').prop('checked', false);
                                    es.hide();
                                }

                            } else {
                                $visibleElement.html($(this).text());
                                if ($hidden[0].value != $(this).data('value')) {
                                    $hidden[0].value = $(this).data('value');
                                    $hidden.trigger('change');
                                }

                                es.hide();
                            }
                        }
                        if (options.onSelect) options.onSelect.call($visibleElement.next(), $(this));
                    }
                    return $visibleElement;
                }
            };
            esObject.init();
            esObject.options = options;
            $hidden.data('timeId', timeId);
            $hidden.data("esObject", esObject);
            return $visibleElement;
        }
    });

})(jQuery);
