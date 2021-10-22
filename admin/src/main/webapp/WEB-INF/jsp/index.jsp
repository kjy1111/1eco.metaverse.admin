<%@ page import="grinbi.utility.context.CurrentContext" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ page import="java.util.Locale" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: toskf
  Date: 2021-10-20
  Time: 오후 1:21
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>$Title$</title>
    <%
        Locale locale = Locale.getDefault();
        if (CurrentContext.getRequest() != null) {
            locale = RequestContextUtils.getLocale(CurrentContext.getRequest());
        }
    %>
    <script src="<%=request.getContextPath() %>/scripts/globalization/messages-<%= locale.getLanguage() %>.js"></script>
    <script src="<c:url value='/scripts/BITPrototype.js'/>"></script>
    <script src="<c:url value='/scripts/jquery-1.12.3.min.js'/>"></script>
    <script src="<c:url value='/scripts/jquery-ui-1.12.1.custom.min.js'/>"></script>
    <script src="<c:url value='/scripts/json2.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.xml2json.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.form.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.format-1.3.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.validate.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.cookie.js'/>"></script>
    <script src="<c:url value='/scripts/aes.js'/>"></script>
    <script src="<c:url value='/scripts/sha256.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.blockUI.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.paging.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.PrintArea.js'/>"></script>
    <script src="<c:url value='/scripts/q.js'/>"></script>
    <script src="<c:url value='/scripts/tmpl.min.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.contextMenu.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.dialogextend.min.js'/>"></script>
    <script src="<c:url value='/scripts/jquery-editable-select.js'/>"></script>
    <script src="<c:url value='/scripts/viewer.min.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.fileDownload.js'/>"></script>
    <script src="<c:url value='/scripts/datepicker.min.js'/>"></script>
    <script src="<c:url value='/scripts/jquery.winFocus.js'/>"></script>
    <script src="<c:url value='/scripts/BITCommon.js'/>"></script>

    <script src="<c:url value='/scripts/jquery_file_upload/jquery.fileupload.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/load-image.min.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/jquery.fileupload-process.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/jquery.fileupload-image.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/jquery.fileupload-validate.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/jquery.fileupload-ui.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/jquery.fileupload-video.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/jquery.fileupload-audio.js'/>"></script>
    <script src="<c:url value='/scripts/jquery_file_upload/jquery.iframe-transport.js'/>"></script>

    <script src="<c:url value='/scripts/jquery.nicescroll.min.js'/>"></script>
    <script src="<c:url value='/scripts/Common.js'/>"></script>

    <script src="<c:url value='/scripts/tinymce/tinymce.min.js'/>"></script>
    <script src="<c:url value='/scripts/tinymce/jquery.tinymce.min.js'/>"></script>

    <link href="<c:url value='/css/jquery-ui.min.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/jquery-editable-select.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/jquery.fileupload.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/BITCommon.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/datepicker.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/jquery.contextMenu.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/viewer.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/BITCommon.css'/>" rel="stylesheet"/>
</head>
<body>
로그인 페이지


<form action="<c:url value='/admin/account/login.do'/>" method="post" modeltype="oneEco.model.logical.OprtrLoginModel">
    <div class="cnt">
        <h1 class="tit">관리자 로그인</h1>
        <dl class="ipt_area">
            <dt>
                <label for="iptId">관리자 ID</label>
            </dt>
            <dd>
                <input type="text" id="iptId" name="userid" class="ipt_id" tabindex="1" placeholder="아이디를 입력하세요."/>
            </dd>
            <dt>
                <label for="iptPw">관리자 PW</label>
            </dt>
            <dd>
                <input type="password" id="iptPw" name="password" class="ipt_pw" tabindex="2"
                       placeholder="패스워드를 입력하세요."/>
            </dd>
        </dl>
        <button type="submit" id="btnLogin" class="btn_login" tabindex="3">로그인</button>
    </div>
</form>

<script type="text/javascript">

    let login = (function () {
        let $container = $("body");

        let init = function () {
            BIT.validate($('form'), function (response) {
            }, function (arr, $form, options) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].name == 'password') {
                        arr[i].value = CryptoJS.SHA256(arr[i].value).toString();
                    }
                }
            });
        };


        let registerEventHandler = function () {
        };

        return {
            init: function () {
                init();
                registerEventHandler();
            }
        };
    })();
    login.init();
</script>
</body>
</html>
