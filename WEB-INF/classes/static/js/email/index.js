/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#emailIndex',
    data: {
        search: {emailAddress: '', emailName: '',  beginDate: '', endDate: ''},
        emails: [],
        beginIndex: 0,
        params: [],
        url: getUrl('email/getEmails')
    },
    methods: {
        getEmails: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                emailAddress: this.search.emailAddress
                , emailName: this.search.emailName
                , beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageIndex, pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.emails = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("email/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        }

    }
});

function setEmailId(emailId) {
    $('#hidEmailId').val(emailId);
}

function clearEmailId() {
    $("#hidEmailId").val('');
}

$(function () {
        clearEmailId();
        app.getEmails();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);