<%@ page import="grinbi.membership.MembershipProvider" %>
<%@ page import="grinbi.utility.context.CurrentContext" %>
<%@ page import="grinbi.utility.siteMap.SiteMapLoader" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Locale" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>SAMPLE</title>

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

    <script src="<c:url value='/scripts/jquery.nicescroll.min.js'/>"></script>
    <script src="<c:url value='/scripts/Common.js'/>"></script>

    <link href="<c:url value='/css/jquery-ui.min.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/jquery-editable-select.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/jquery.fileupload.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/BITCommon.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/datepicker.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/jquery.contextMenu.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/viewer.css'/>" rel="stylesheet"/>
    <link href="<c:url value='/css/BITCommon.css'/>" rel="stylesheet"/>
    <tiles:insertAttribute name="header"/>
</head>
<body>
<div class="head_area">
    <div class="header">
        <%= SiteMapLoader.getGlobalNavigationBar(new HashMap<String, String>() {{
            put("hideGNB", "N");
        }}, 2) %>
    </div>
</div>
<div id="wrap">
    <div id="container">
        <tiles:insertAttribute name="content"/>
        <div class="clr"></div>
    </div>

    <tiles:insertAttribute name="footer"/>
</div>
<!--// wrap-->

</body>
</html>