/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#logIndex',
    data: {
        date: '',
        search: {
            content: '',
            system: -1,
            param: '',
            requestUri: '',
            name: '',
            cellphone: '',
            beginDate: '',
            endDate: '',
            ym: ''
        },
        logs: [],
        url: getUrl('log/getLogs')
    },
    methods: {
        getLogs: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var txtYm = $("#txtYm").val();
            app.search.txtYm = txtYm;
            var params = {
                content: this.search.content,
                system: this.search.system,
                param: this.search.param,
                requestUri: this.search.requestUri,
                name: this.search.name,
                cellphone: this.search.cellphone,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                ym: txtYm,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.logs = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});


$(function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    $("#txtYm").val(year + seperator1 + month);

    app.getLogs();
    $("#txtBeginDate,#txtEndDate,#txtYm").click(function () {
        WdatePicker();
    });

});
