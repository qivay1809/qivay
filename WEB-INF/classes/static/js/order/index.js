/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#orderIndex',
    data: {
        search: {creator: '',  minAmount: 0.00, maxAmount: 0.00, beginDate: '', endDate: '', orderStatus: -1},
        orders: [],
        url: getUrl('order/getOrders')
    },
    methods: {
        getOrders: function (msg) {
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
                creator: this.search.creator,
                minAmount: this.search.minAmount
                ,
                maxAmount: this.search.maxAmount,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                orderStatus: this.search.orderStatus,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.orders = response.data.obj.rows;
                    if (!app.search.minAmount){
                        app.search.minAmount = null;
                    }
                    if (!app.search.maxAmount){
                        app.search.maxAmount = null;
                    }
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                })
        }

    }
});

$(function () {
    app.getOrders();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
});
