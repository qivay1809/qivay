/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#noticeIndex',
    data: {
        search: {noticeTitle: '', creator: '', beginDate: '', endDate: '',noticeShow:-1},
        beginIndex: 0,
        notices: [],
        url: getUrl('notice/getNotices')
    },
    methods: {
        getNotices: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                noticeTitle: this.search.noticeTitle,
                creator: this.search.creator,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                noticeShow: this.search.noticeShow,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.notices = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }

    }
});

function setNoticeId(noticeId) {
    $('#hidNoticeId').val(noticeId);
}

function clearNoticeId() {
    $("#hidNoticeId").val('');
}


$(function () {
    app.getNotices();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearNoticeId();
});
