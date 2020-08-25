/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#enterpriseIndex',
    data: {
        search: {enterpriseName: '', address: '', certificateId: '', userName: '', cellphone: '', enterpriseVerify: -1, beginDate: '', endDate: ''},
        enterprises: [],
        beginIndex: 0,
        params: [],
        url: getUrl('enterprise/getEnterprises'),
        exportUrl: getUrl("enterprise/exportExcel")
    },
    methods: {
        getEnterprises: function (msg) {
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
                enterpriseName: this.search.enterpriseName
                ,
                address: this.search.address,
                certificateId: this.search.certificateId,
                userName: this.search.userName,
                cellphone: this.search.cellphone,
                enterpriseVerify: this.search.enterpriseVerify
                ,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageIndex,
                pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.enterprises = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("enterprise/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        }

    }
});

function setEnterpriseId(enterpriseId) {
    $('#hidEnterpriseId').val(enterpriseId);
}


function clearEnterpriseId() {
    $("#hidEnterpriseId").val('');
}

$(function () {
        clearEnterpriseId();
        app.getEnterprises();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);
function del(enterpriseId) {
    if (confirm("删除后不可恢复，确定要删除吗？")) {
        $.ajax({
            url: "/enterprise/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "enterpriseId": enterpriseId
            }, //参数值
            type: "GET", //请求方式
            success: function (response) {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
    }
}