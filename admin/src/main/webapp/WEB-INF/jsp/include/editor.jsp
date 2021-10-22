<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: admin
  Date: 2021-06-02
  Time: 오후 4:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<tr>
    <th scope="row"><em>*</em>내용</th>
    <td>
        <div id="Editor">
            <textarea class="text_area" id="cn" name="cn" title="내용"></textarea>
            <input id="EditorImage" type="file" accept=".gif,.jpg,.jpeg,.png" style="display: none;" title="파일등록"/>
        </div>
    </td>
</tr>

<script type="text/javascript">

    let editor = (function () {
        let $callback = null;

        let initEditor = function () {
            tinymce.init({
                selector: "[name=${textareaName}]",
                language: langCode,
                theme: 'silver',
                resize: false,
                convert_urls: false,
                image_advtab: true,
                height: 466,
                plugins: [
                    "advlist autolink lists link image charmap preview hr anchor pagebreak",
                    "searchreplace visualblocks visualchars code fullscreen",
                    "insertdatetime nonbreaking save table directionality",
                    "emoticons template paste imagetools"],
                toolbar1: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | preview | forecolor backcolor emoticons",
                file_picker_types: "image",
                file_picker_callback: function (callback, value, meta) {
                    $callback = callback;
                    if (meta.filetype == 'image') {
                        $("#EditorImage").trigger("click");
                    }
                }
            })
        };

        let init = function () {
            // 에디터 이미지 업로드
            BIT.uploadSingleFile($("#EditorImage"), '<c:url value="/file/upload.do"/>', {
                Category: "Editor"
            }, /^image\/(jpe?g|png|gif)$/i, 5120000, function (data) {
                if ($callback != null) {
                    $callback('<c:out value="${UploadPath}" />/' + data.Category + '/' + data.VirtualName);
                }
            });
        };

        let push = function (content) {
            let $t = tinymce;
            if ($t.isIE) {
                tinymce.editors[0].setContent(content);
            }
        };

        return {
            init: function () {
                init();
            },
            push: function (content) {
                push(content);
            },
            initEditor: function () {
                initEditor();
            }
        };
    })();
    editor.init();
</script>