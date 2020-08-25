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
            shopType: -1
        },
        provinces: [],
        cities: [],
        areas: [],
        clues: [],
        beginIndex: 0,
        params: [],
        url: getUrl('clue/getClueHistories')
        // exportUrl: getUrl("clue/exportExcel")
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
                validate: this.search.clueVerify
                , beginDate: this.search.beginDate, endDate: this.search.endDate,
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
        app.getClues();
        app.getProvinces();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);