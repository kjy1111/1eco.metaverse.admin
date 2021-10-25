<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div id="N-01-02">
    <div class="cnt_tit">
        <h2 class="nav_1_1">등록</h2>
    </div>
    <div class="contents" id="B_02">
        <form action='<c:url value="/admin/bbsctt/add.do" />' method="post" modeltype="daygen.model.physical.BbsModel">
            <div class="gnb01">
                <table class="tbl_1">
                    <caption>정보입력</caption>
                    <colgroup>
                        <col style="width: 20%">
                        <col style="width: 80%">
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row"><em>*</em>분류</th>
                        <td>
                            <select name="clTypeCode">
                                <option value="언론보도">언론보도</option>
                                <option value="공지사항">공지사항</option>
                                <option value="회사소식">회사소식</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><em>*</em>제목</th>
                        <td>
                            <input type="text" name="sj" class="ipt_long" placeholder="제목을 입력합니다."/>
                        </td>
                    </tr>
                    <jsp:include page="/common/editor.do">
                        <jsp:param name="textareaName" value="cn"/>
                    </jsp:include>
                    <tr>
                        <th scope="row"><em>*</em>게시글 노출여부</th>
                        <td>
                            <input type="radio" name="ActvtyYn" value="Y" checked="checked"/>
                            <label>Yes</label>
                            <input type="radio" name="ActvtyYn" class="ml20" value="N"/>
                            <label>No</label>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="btn_area">
                    <button name="btn_delete" class="btn_left">삭제</button>
                    <button name="btn_list">목록</button>
                    <button type="submit" name="btn_submit">확인</button>
                </div>
            </div>
        </form>
    </div>
</div>

<script type="text/javascript">
    let n_01_02 = (function () {
        let $container = $("#N-01-02");

        let init = function () {
            if (!BIT.isNullOrEmpty(editor)){
                editor.initEditor();
            }

            BIT.validate($container.find('form'), 'formdata', function (response) {
                if (response.IsSucceed) {
                    location.href = '<c:url value="/page.do?pageid=N-01"/>';
                }
            });
        };

        let registerEventHandler = function () {
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

    n_01_02.init();
</script>

