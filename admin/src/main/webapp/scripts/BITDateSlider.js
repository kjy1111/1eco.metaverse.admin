(function ($) {
    $.fn.BITDateSlider = function (o) {

        var s = {
            viewPageNumber: 10,
            width: 300, //전체 너비
            itemWidth: 30,  // 하나의 아이템의 너비
            marginWidth: 1, // 아이템간의 마진 너비
            leftButtonSelector: null,
            rightButtonSelector: null,
            speed: 2,
            dateType: 'day',         // day, week, month
            onMouseLeaved: null,
            onPageItemClicked: null
        };
        var totalPageNumber = 100;

        var c = {
            realWid: 0,
            selectedDate: null,
            currentDate: 1,
            currentValue: 0,
            isMoving: false        // 이동중인가?
        };

        return this.each(function () {

            var $this = $(this);
            if (o)
                $.extend(s, o);

            initialize();

            $(this).bind('reset', function (event, o) {
                $.extend(s, o);
                initialize();
            });

            $(this).bind('select', function (event, o) {
                $.extend(c, o);
                updateItem(c.currentDate);
            });

            if (s.leftButtonSelector.size() > 0) {
                s.leftButtonSelector.bind('mouseenter', function () {
                    return onEnterButton($(this), 'left');
                });
            }
            if (s.leftButtonSelector.size() > 0) {
                s.leftButtonSelector.bind('mouseleave', function () {
                    return onLeaveButton($(this));
                });
            }
            if (s.rightButtonSelector) {
                $(s.rightButtonSelector).bind('mouseenter', function () {
                    return onEnterButton($(this), 'right');
                });
            }
            if (s.rightButtonSelector) {
                $(s.rightButtonSelector).bind('mouseleave', function () {
                    return onLeaveButton($(this));
                });
            }

            function onEnterButton(e, dir) {
                c.isMoving = true;
                move(dir);
            }

            function onLeaveButton(e) {
                reset();
                if (s.onMouseLeaved != null) {
                    s.onMouseLeaved.call(this, $this);
                }
            }

            function onPageItemClick() {
                if (s.onPageItemClicked != null) {
                    s.onPageItemClicked.call(this, $this, c.selectedDate);
                }
            }

            function updateItem(newDate) {
                $this.find(".pageItem.selected").removeClass("selected");

                var n, cDate;
                if (s.dateType == 'day') {
                    n = newDate.getDate();
                } else if (s.dateType == 'week') {
                    n = newDate.getDate();
                } else {
                    n = newDate.getMonth() + 1;
                }
                cDate = newDate;
                $($this.find(".pageItemContainer .pageItem").get().reverse()).each(function (i) {
                    $(this).data('date', cDate.toString('yyyy-MM-dd'));
                    $(this).attr('title', cDate.toString('yyyy-MM-dd'));
                    if (s.dateType == 'day') {
                        n = cDate.getDate();
                        cDate = cDate.addDay(-1);
                    } else if (s.dateType == 'week') {
                        n = cDate.getDate();
                        cDate = cDate.addWeek(-1);
                    } else {
                        n = cDate.getMonth() + 1;
                        cDate = cDate.addMonth(-1);
                    }
                    $(this).html(n);
                    if (c.selectedDate != null && c.selectedDate == $(this).data('date')) {
                        $(this).addClass('selected');
                    }
                });
                if (c.selectedDate == null) {
                    var $selected = $this.find(".pageItemContainer .pageItem").last();
                    $selected.addClass('selected');
                    c.selectedDate = $selected.data('date');
                    //onPageItemClick();
                }

                c.currentDate = newDate;
                c.currentValue = 0;
            }

            function moveGap(gap) {
                c.currentValue += gap;
                var pageGap = parseInt(c.currentValue);

                var newDate;

                if (s.dateType == 'day') {
                    newDate = c.currentDate.addDay(pageGap);
                } else if (s.dateType == 'week') {
                    newDate = c.currentDate.addWeek(pageGap);
                } else {
                    newDate = c.currentDate.addMonth(pageGap);
                }

                if (newDate > new Date()) {
                    if (s.dateType != 'week') {
                        updateItem(new Date());
                    } else {
                        updateItem(new Date().addDay(-new Date().getDay()));
                    }
                    
                    c.currentValue = 0;
                    reset();
                    return;
                }

                if (gap == 0) {
                    return;
                }
                    
                if (pageGap != 0) {
                    updateItem(newDate);
                }
            }

            function reset() {
                c.isMoving = false;
            }

            function move(dir) {
                if (c.isMoving) {
                    var gap = Math.abs(s.speed) / 50;
                    if (dir == 'left') {
                        gap *= -1;
                    }
                    moveGap(gap);
                    setTimeout(function () {
                        move(dir);
                    }, 10);
                }
            }

            function initialize() {
                s.viewPageNumber = Math.min(s.viewPageNumber, totalPageNumber);

                $this.find(".pageItemContainer > .pageItem").remove();
                for (i = 1; i <= s.viewPageNumber + 2; i++) {
                    $this.find(".pageItemContainer").append($("<a class='pageItem'></a>"));
                }
                $this.find(".pageItemContainer .pageItem").last().addClass('selected');
                $this.find(".pageItemContainer .pageItem").click(function () {
                    $this.find(".pageItem.selected").removeClass("selected");
                    $(this).addClass('selected');
                    c.selectedDate = $(this).data('date');
                    onPageItemClick();
                });

                if (s.leftButtonSelector.size() > 0) {
                    s.leftButtonSelector.show();
                }
                if (s.rightButtonSelector.size() > 0) {
                    s.rightButtonSelector.show();
                }

                var borderPx = 0;
                var sBorder = $this.find(".pageItem").first().css("border-left-width");
                if (sBorder.indexOf("px") > 0) {
                    borderPx = sBorder.replace("px", "") * 1;
                }

                c.realWid = s.itemWidth + s.marginWidth * 2 + borderPx * 2;

                var widAll = 1 * c.realWid * s.viewPageNumber;

                $this.find(".pageItem").css("width", s.itemWidth + "px");
                $this.find(".pageItem").css("margin", "0 " + s.marginWidth + "px 0 " + s.marginWidth + "px");

                $this.find(".pageItem_wrap").css("width", widAll + "px");
                $this.find(".paginator_slider").css("width", widAll + "px");

                var date = new Date();

                if (s.dateType == 'week') {
                    date = date.addDay(-date.getDay());
                } else if (s.dateType == 'month') {
                    date = date.addDay(1 - date.getDate());
                }

                if (c.selectedDate != null) {
                    c.selectedDate = date.toString("yyyy-MM-dd");
                }

                updateItem(date);
            }
        });
    };
})(jQuery);