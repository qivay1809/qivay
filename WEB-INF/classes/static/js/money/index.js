/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#moneyTransferIndex',
    data: {
        loading:true,
        search: {remark: '', realName: '', minAmount: 0.00, maxAmount: 0.00, beginDate: getYmd(), endDate: getYmd(), transferType: -1, transferAccount: -1},
        moneyTransferRecords: [],
        url: getUrl('money/getMoneyTransferRecords'),
        exportUrl: getUrl('money/exportExcel'),
        inAmount:0,
        outAmount:0
    },
    methods: {
        getMoneyTransferRecords: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            if (!app.search.minAmount){
                app.search.minAmount = 0.00;
            }
            if (!app.search.maxAmount){
                app.search.maxAmount = 0.00;
            }

            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                remark: this.search.remark
                ,
                realName: this.search.realName,
                minAmount: this.search.minAmount
                ,
                maxAmount: this.search.maxAmount,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                transferType: this.search.transferType,
                transferAccount: this.search.transferAccount,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.moneyTransferRecords = response.data.obj.rows;
                    if (!app.search.minAmount){
                        app.search.minAmount = null;
                    }
                    if (!app.search.maxAmount){
                        app.search.maxAmount = null;
                    }
                    var msg = response.data.msg;
                    var m= $.parseJSON(msg);
                    this.inAmount = m.in;
                    this.outAmount = m.out;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                    this.exportUrl = getUrl("money/exportExcel") + "?" + getExportExcelParams(this.params);
                });
            app.loading = false;
        }

    }
});




$(function () {
    app.getMoneyTransferRecords();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
});
