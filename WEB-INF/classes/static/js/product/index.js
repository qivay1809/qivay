/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#productIndex',
    data: {
        search: {productName: '', brandName: '', productVerify: -1, beginDate: '', endDate: ''},
        products: [],
        beginIndex: 0,
        params: [],
        url: getUrl('product/getProducts'),
        exportUrl: getUrl("product/exportExcel")
    },
    methods: {
        getProducts: function (msg) {
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
                productName: this.search.productName
                , brandName: this.search.brandName, productVerify: this.search.productVerify
                , beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageVM.current_page, pageSize: 10
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.products = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("product/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        }

    }
});

function setProductId(productId) {
    $('#hidProductId').val(productId);
}


function clearProductId() {
    $("#hidProductId").val('');
}

$(function () {
        clearProductId();
        app.getProducts();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);


function del(productId) {
    if (confirm("删除后不可恢复，确定要删除吗？")) {
        $.ajax({
            url: "/product/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "productId": productId
            }, //参数值
            type: "POST", //请求方式
            success: function (response) {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
    }
}