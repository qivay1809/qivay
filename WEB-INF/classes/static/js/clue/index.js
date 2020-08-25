/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#clueIndex',
    data: {
        search: {
            provinceId: '',
            cityId: '',
            areaId: '',
            street: '',
            userName: '',
            cellphone: '',
            brandName: '',
            productName: '',
            clueVerify: -1,
            taskTitle: '',
            taskId: '',
            hasTask: -1,
            clueId: '',
            beginDate: '',
            endDate: '',
            shopType: -1,
            serialNumber: '',
            approved:-1,
            uploaded:-1,
            published:-1

        },
        provinces: [],
        cities: [],
        areas: [],
        clues: [],
        beginIndex: 0,
        authority: 0,
        params: [],
        url: getUrl('clue/getClues'),
        exportUrl: getUrl("clue/exportExcel")
    },
    methods: {
        getClues: function (msg) {
            var regionId = '';
            if (this.search.areaId) {
                regionId = this.search.areaId;
            } else if (this.search.cityId) {
                regionId = this.search.cityId;
            } else if (this.search.provinceId) {
                regionId = this.search.provinceId;
            }
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
                regionId: regionId
                ,
                street: this.search.street,
                userName: this.search.userName,
                cellphone: this.search.cellphone,
                brandName: this.search.brandName,
                productName: this.search.productName,
                taskTitle: this.search.taskTitle,
                taskId: this.search.taskId,
                clueId: this.search.clueId,
                hasTask: this.search.hasTask,
                shopType: this.search.shopType,
                serialNumber: this.search.serialNumber,
                validate: this.search.clueVerify
                , beginDate: this.search.beginDate, endDate: this.search.endDate,
                approved:this.search.approved,uploaded:this.search.uploaded,published:this.search.published,

                pageIndex: pageIndex,
                pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.clues = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("clue/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        },
        getProvinces: function () {
            this.$http.post(getUrl('region/getProvinces'), {emulateJSON: true})
                .then(function (response) {
                    this.provinces = response.data.obj;
                })
        },
        getSubrange: function (id) {
            this.$http.post(getUrl('region/getChildes'), {regionId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (id.length <= 3) {
                        this.cities = response.data.obj;
                        this.areas = [];
                        this.search.cityId = '';
                    } else {
                        this.areas = response.data.obj;
                    }
                    this.search.areaId = '';
                })
        },
        getUserAuthority : function () {
            this.$http.post(getUrl("/user/currentUser"), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.authority = user.admin;
                    }
                    else alert('服务器内部错误');
                })
        }

    }
});

function setClueId(clueId) {
    $('#hidClueId').val(clueId);
}

function setTaskId() {
    app.search.taskId = $("#txtTaskId").val();
}


function clearClueId() {
    $("#hidClueId").val('');
}

$(function () {
        clearClueId();
        app.getUserAuthority();
        app.getClues();
        app.getProvinces();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);

function del(clueId) {
    if (confirm("删除后不可恢复，确定要删除吗？")) {
        $.ajax({
            url: "/clue/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "clueId": clueId
            }, //参数值
            type: "GET", //请求方式
            success: function () {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
    }
}