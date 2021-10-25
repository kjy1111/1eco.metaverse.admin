
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
            <tbody>
            <tr>
                <td>1</td>
                <td>이벤트</td>
                <td>
                    <a href="javascript:;">1ECO Meta World 오픈 이벤트</a>
                </td>
                <td>2021-11-20</td>
                <td>admin</td>
            </tr>
            <tr>
                <td>2</td>
                <td>공지</td>
                <td>
                    <a href="javascript:;">더블 적립 이벤트 시작</a>
                </td>
                <td>2021-11-21</td>
                <td>admin</td>
            </tr>
            <tr>
                <td>1</td>
                <td>채용</td>
                <td>
                    <a href="javascript:;">Local Market 에디터 모집</a>
                </td>
                <td>2021-11-21</td>
                <td>admin</td>
            </tr>

            </tbody>
            <tfoot>
            <tr>
                <td colspan="6">
                    <div class="btn_area">
                        <a class="btn_register" name="btnRegist" href="">등록</a>
                    </div>
                    <div id="pager">
                        <a class="btn_paging_prev" href="javascript:;" data-page="1">&lt;&lt;</a>
                        <a class="btn_paging_first" href="javascript:;" data-page="1">&lt;</a>
                        <a title="" class="paging_active active" href="javascript:;" data-page="1">1</a>
                        <a title="" class="paging_active active" href="javascript:;" data-page="1">2</a>
                        <a title="" class="paging_active active" href="javascript:;" data-page="1">3</a>
                        <a title="" class="paging_active active" href="javascript:;" data-page="1">4</a>
                        <a title="" class="paging_active active" href="javascript:;" data-page="1">5</a>
                        <a class="btn_paging_next" href="javascript:;" data-page="1">&gt;</a>
                        <a class="btn_paging_last" href="javascript:;" data-page="1">&gt;&gt;</a>
                    </div>
                </td>
            </tr>
            </tfoot>
        </table>
        <div class="foot">
            <select name="" id="" class="footselect">
                <option value="">제목</option>
                <option value="">내용</option>
                <option value="">제목+내용</option>
            </select>
            <input type="text" class="ipt_basic" name=""  placeholder="이벤트">
            <button>검색</button>
        </div>
    </div>
</div>

<script type="text/javascript">

    let n_01 = (function () {
        let $container = $("#N-01");

        let init = function () {
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
    n_01.init();
</script>