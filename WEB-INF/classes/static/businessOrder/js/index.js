/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#businessOrderIndex',
    data: {
        beginIndex:0,
        search: {
            name: '', phone: '', status: -1,
            beginDate: getYmd(), endDate: getYmd(),
            payBeginDate: '', payEndDate: ''},
        businessOrders: [],
        url: getUrl('businessOrder/getBusinessOrders'),
        exportUrl1: getUrl('businessOrder/exportExcel')
    },
    methods: {
        getIprDeals: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;

            var payBeginDate = $("#txtPayBeginDate").val();
            app.search.payBeginDate = payBeginDate;
            var payEndDate = $("#txtPayEndDate").val();
            app.search.payEndDate = payEndDate;
            var params = {
                name: this.search.name,
                phone: this.search.phone,
                status: this.search.status,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,

                payBeginDate: this.search.payBeginDate,
                payEndDate: this.search.payEndDate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.businessOrders = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    console.log("excelparam"+getExportExcelParams(params));
                    this.exportUrl1 = getUrl("businessOrder/exportExcel") + "?" + getExportExcelParams(params);
                })
        }

    }
});

function clearIprDealId() {
    $("#hidIprDealId").val('');
}

$(function () {
    app.getIprDeals();
    clearIprDealId();
    $("#txtBeginDate,#txtEndDate,#txtPayBeginDate,#txtPayEndDate").click(function () {
        WdatePicker();
    });
});
