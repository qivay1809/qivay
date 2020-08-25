/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#brandIndex',
    data: {
        search: {brandName: '', enterpriseName: '', brandVerify: -1, beginDate: '', endDate: ''},
        brands: [],
        beginIndex: 0,
        params: [],
        url: getUrl('brand/getBrands'),
        exportUrl: getUrl("brand/exportExcel")
    },
    methods: {
        getBrands: function (msg) {
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
                brandName: this.search.brandName
                ,
                enterpriseName: this.search.enterpriseName,
                brandVerify: this.search.brandVerify
                ,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageIndex,
                pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.brands = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("brand/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        }

    }
});

function setBrandId(brandId) {
    $('#hidBrandId').val(brandId);
    $('#hidEdit').val("1");
}

function setBrandAndVerify(brandId, brandVerify) {
    $('#hidBrandId').val(brandId);
    $("#hidBrandVerify").val(brandVerify);
}

function clearBrandId() {
    $("#hidBrandId").val('');
    $("#hidBrandVerify").val('');
    $('#hidEdit').val("");
}

function del(brandId) {
    if (confirm("此次操作会删除已被关联的产品，确定要删除吗？")) {
        $.ajax({
            url: "/brand/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "brandId": brandId
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

$(function () {
        clearBrandId();
        app.getBrands();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);