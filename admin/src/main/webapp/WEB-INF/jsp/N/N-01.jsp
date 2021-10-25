<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div class="contents" id="N-01">
    <div class="gnb01">
        <select name="SearchType">
            <option value="">korean</option>
            <option value="">english</option>
        </select>
        <table class="tbl_2">
            <div class="cnt_tit">
                <h2 class="nav_1_1">전체공지</h2>
            </div>
            <caption>전체공지</caption>
            <colgroup>
                <col style="width: 10%"/>
                <col style="width: 10%"/>
                <col style="width: 50%"/>
                <col style="width: 15%"/>
                <col style="width: 15%"/>
            </colgroup>
            <thead>
            <tr>
                <th scope="col">번호</th>
                <th scope="col">분류</th>
                <th scope="col">제목</th>
                <th scope="col">날짜</th>
                <th scope="col">등록자</th>
            </tr>
            </thead>
            <tbody name="tbodyBbsList">
<%--            <tr>--%>
<%--                <td>1</td>--%>
<%--                <td>이벤트</td>--%>
<%--                <td>--%>
<%--                    <a href="javascript:;">1ECO Meta World 오픈 이벤트</a>--%>
<%--                </td>--%>
<%--                <td>2021-11-20</td>--%>
<%--                <td>admin</td>--%>
<%--            </tr>--%>
<%--            <tr>--%>
<%--                <td>2</td>--%>
<%--                <td>공지</td>--%>
<%--                <td>--%>
<%--                    <a href="javascript:;">더블 적립 이벤트 시작</a>--%>
<%--                </td>--%>
<%--                <td>2021-11-21</td>--%>
<%--                <td>admin</td>--%>
<%--            </tr>--%>
<%--            <tr>--%>
<%--                <td>1</td>--%>
<%--                <td>채용</td>--%>
<%--                <td>--%>
<%--                    <a href="javascript:;">Local Market 에디터 모집</a>--%>
<%--                </td>--%>
<%--                <td>2021-11-21</td>--%>
<%--                <td>admin</td>--%>
<%--            </tr>--%>

            </tbody>
            <tfoot>
            <tr>
                <td colspan="6">
                    <div class="btn_area">
                        <a class="btn_register" name="btnRegist" href="">등록</a>
                    </div>
                    <div id="pager">
<%--                        <a class="btn_paging_prev" href="javascript:;" data-page="1">&lt;&lt;</a>--%>
<%--                        <a class="btn_paging_first" href="javascript:;" data-page="1">&lt;</a>--%>
<%--                        <a title="" class="paging_active active" href="javascript:;" data-page="1">1</a>--%>
<%--                        <a title="" class="paging_active active" href="javascript:;" data-page="1">2</a>--%>
<%--                        <a title="" class="paging_active active" href="javascript:;" data-page="1">3</a>--%>
<%--                        <a title="" class="paging_active active" href="javascript:;" data-page="1">4</a>--%>
<%--                        <a title="" class="paging_active active" href="javascript:;" data-page="1">5</a>--%>
<%--                        <a class="btn_paging_next" href="javascript:;" data-page="1">&gt;</a>--%>
<%--                        <a class="btn_paging_last" href="javascript:;" data-page="1">&gt;&gt;</a>--%>
                    </div>
                </td>
            </tr>
            </tfoot>
        </table>
        <div class="foot">
            <select name="searchType" id="" class="footselect">
                <option value="01">제목</option>
                <option value="02">내용</option>
                <option value="03">제목+내용</option>
            </select>
            <input type="text" class="ipt_basic" name="btnAdd"  placeholder="이벤트">
            <button>검색</button>
        </div>
    </div>
</div>

<script type="text/x-tmpl" id="tmplBbsList">
    {% for (let i=0, data; data=o[i]; i++) { %}
    <tr data-data="{%=JSON.stringify(data)%}">
        <td>{%= data.rowNum %}</td>
        <td>{%= data.ctgry %}</td>
        <td><a href='<c:url value="/page.do?pageid=N01-01&bbscttPid="/>{%= data.bbscttPid %}'>{%= BIT.htmlDecode(data.sj) %}</a></td>
        <td>{%= BIT.convertToDate(data.creatDt).toString('yyyy-MM-dd') %}</td>
        <td>{%= data.id %}</td>
    </tr>
    {% } %}
</script>

<script type="text/javascript">

    let n_01 = (function () {
        let $container = $('#N-01');
        let currentPage = parseInt(BIT.isNullOrEmpty($.getUrlVar('pageNumber')) ? 1 : $.getUrlVar('pageNumber'));
        let searchData = {};

        let search = function () {
            searchData = $.extend({}, $container.getObject(), {
                pageSize: 10,
                pageNumber: currentPage
                // clturTypeCode: 'KO'
            });

            return BIT.callAjax('<c:url value="/admin/bbsctt/getBbscttList.do" />', 'post', searchData, function (response) {
                if (response.IsSucceed) {
                    if (response.totalrecords > 0) {
                        $container.find('[name=tbodyBbsList]').empty().append(tmpl('tmplBbsList', response.rows));

                        let options = {
                            page: response.pagenum,
                            perpage: searchData.pageSize,
                            onSelect: function (page) {
                                currentPage = isNaN(page) ? 1 : page;
                                if (currentPage != response.pagenum) {
                                    COM.showLoading();
                                    search().done(function () {
                                        COM.hideLoading();
                                    });
                                }
                            },
                        };

                        COM.pager($container.find('#pager'), response.totalrecords, options);
                        $container.find('#pager').closest('tr').show();
                    } else {
                        $container.find('[name=tbodyBbsList]').empty().append("<tr><td colspan='5' style='height: 50px;alignment: center;vertical-align: center'>검색결과가 없습니다.</td></tr>");
                        $container.find('#pager').closest('tr').hide();
                    }
                }
            });
        };

        let init = function () {
            searchData = location.href.queryStringToJSON();
            BIT.bindObjectData(searchData, {$parent: $container});
        };

        let lazyInit = function () {
            search();
        };

        let registerEventHandler = function () {
            // 검색 이벤트
            $container.find('[name=btnSearch]').click(function (e) {
                e.preventDefault();

                currentPage = 1;
                search();
            });

            // 엔터 이벤트
            $container.find('[name=searchText]').keydown(function (e) {
                if (e.keyCode === 13) {
                    $container.find('[name=btnSearch]').trigger('click');
                }
            });

            // 목록 클릭 이벤트
            $container.find('[name=tbodyBbsList]').on('click', 'tr a', function (e) {
                e.preventDefault();

                location.href = $(this).attr('href') + '&' + $(searchData).convertQueryString();
            });

            // 등록 이벤트
            $container.find('[name=btnAdd]').click(function (e) {
                e.preventDefault();

                location.href = '<c:url value="/page.do?pageid=N-01-02"/>';
            });
        };

        return {
            init: function () {
                init();
                registerEventHandler();
                $(function () {
                    lazyInit();
                });
            }
        };
    })();

    n_01.init();
</script>