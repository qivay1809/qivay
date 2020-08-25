/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#transferIndex',
    data: {
        search: {
            transferRemark: '',
            userName: '',
            minTransferAmount: 0.00,
            maxTransferAmount: 0.00,
            beginDate: '',
            endDate: '',
            transferType: -1,
            creatorType: -1,
            accountType: -1
        },
        transferRecords: [],
        url: getUrl('transfer/getTransferRecords'),
        exportUrl: getUrl("transfer/exportExcel")
    },
    methods: {
        getTransferRecords: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            if (!app.search.minTransferAmount) {
                app.search.minTransferAmount = 0.00;
            }
            if (!app.search.maxTransferAmount) {
                app.search.maxTransferAmount = 0.00;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                transferRemark: this.search.transferRemark
                ,
                userName: this.search.userName,
                minTransferAmount: this.search.minTransferAmount
                ,
                maxTransferAmount: this.search.maxTransferAmount,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                transferType: this.search.transferType,
                creatorType: this.search.creatorType,
                accountType: this.search.accountType,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.transferRecords = response.data.obj.rows;
                    if (!app.search.minTransferAmount) {
                        app.search.minTransferAmount = null;
                    }
                    if (!app.search.maxTransferAmount) {
                        app.search.maxTransferAmount = null;
                    }
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.exportUrl = getUrl("transfer/exportExcel") + "?" + getExportExcelParams(this.params);
                })
        }

    }
});

$(function () {
    app.getTransferRecords();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
});
