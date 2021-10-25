<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div id="N-01-01">

</div>

<script type="text/javascript">
    let n_01_01 = (function () {
        let $container = $('#N-01-01');

        let getBbsctt = function () {
            return BIT.callAjax('<c:url value="/admin/bbsctt/getBbsctt.do" />', 'post', { bbsPid: $.getUrlVar("bbscttPid") }, function (response) {
                if (response.IsSucceed) {
                    let data = response.Data;

                    BIT.bindObjectData(data, { $parent: $container });

                    $container.find('[name=creatDt]').text(BIT.convertToDate(data.creatDt).toString('yyyy-MM-dd'));
                    $container.find('[name=cn]').html(BIT.htmlDecode(data.cn));
                }
            });
        };

        let init = function () {
            if ($.getUrlVar('bbscttPid') != null) {
                if(isNaN($.getUrlVar('bbscttPid'))){
                    BIT.modal('유효하지 않은 요청입니다','알림',function () {
                        $container.find('[name=btnList]').trigger('click');
                    });
                    return;
                }

                COM.showLoading();
                getBbsctt().done(function () {
                    COM.hideLoading();
                });
            } else {
                BIT.modal('유효하지 않은 요청입니다','알림',function () {
                    $container.find('[name=btnList]').trigger('click');
                });
            }
        };


        let registerEventHandler = function () {
            // 다음글 이벤트

            // 이전글 이벤트

            // 목록 이벤트
            $container.find('[name=btnList]').click(function (e) {
                e.preventDefault();

                if ($.getUrlVar('bbscttPid') != null) {
                    location.href = '<c:url value="/page.do?pageid=N-01&"/>' + window.location.href.slice(window.location.href.indexOf('&') + 1);
                } else {
                    location.href = '<c:url value="/page.do?pageid=N-01"/>';
                }
            });

            // 수정 이벤트
            $container.find('[name=btnModify]').click(function (e) {
                e.preventDefault();

                location.href = '<c:url value="/page.do?pageid=N-01-01-01&bbscttPid="/>' + $.getUrlVar('bbscttPid');
            });

        };

        return {
            init: function () {
                init();
                registerEventHandler();
            }
        };
    })();

    n_01_01.init();
</script>

