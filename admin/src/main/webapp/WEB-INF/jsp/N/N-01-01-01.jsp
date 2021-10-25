<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div id="N-01-01-01">

</div>

<script type="text/javascript">
    let n_01_01_01 = (function () {
        let $container = $('#N-01-01-01');

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
            COM.showLoading();
            getBbsctt().done(function () {
                COM.hideLoading();
            });
        };

        let registerEventHandler = function () {
            // 취소 이벤트
            $container.find('[name=btnCancel]').click(function(e){
                e.preventDefault();

                location.href = '<c:url value="/page.do?pageid=N-01&"/>' + window.location.href.slice(window.location.href.indexOf('&') + 1);
            });

            // 저장 이벤트
            $container.find('[name=btnSubmit]').click(function (e) {
                e.preventDefault();

                tinymce.triggerSave();

                if ($.trim($container.find('[name=cn]').val()) === '') {
                    BIT.modal('내용을 입력 하세요.');
                    return;
                }
                $container.find('form').submit();
            });
        };

        return {
            init: function () {
                init();
                registerEventHandler();
            }
        };
    })();

    n_01_01_01.init();
</script>

