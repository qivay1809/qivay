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
            brandName: '',
            productName: '',
            clueVerify: -1,
            taskTitle: '',
            clueId: '',
            hasTask: -1,
            beginDate: '',
            endDate: '',
            serialNumber: ''
        },
        provinces: [],
        cities: [],
        areas: [],
        clues: [],
        beginIndex: 0,
        params: [],
        url: getUrl('clue/getClueProgresses'),
        exportUrl: getUrl("clue/exportClueProgressExcel")
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
                brandName: this.search.brandName,
                productName: this.search.productName,
                taskTitle: this.search.taskTitle,
                clueId: this.search.clueId,
                hasTask: this.search.hasTask,
                serialNumber: this.search.serialNumber,
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
                    this.exportUrl = getUrl("clue/exportClueProgressExcel") + "?" + getExportExcelParams(this.params);
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

function startFollow(clueId) {
    $.confirm({
        title: '跟进',
        content: '<h4>您确定要开始跟进吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.$http.post(getUrl('clue/startFollow'),{clueId:clueId}, {emulateJSON: true})
                        .then(function (response) {
                            if (response.data.code === 200) {
                                $('#txtSearch').click();
                            }
                            else alert('服务器内部错误');
                        })
                }
            },
            '取消': {
                btnClass: 'btn-default',
                action: function () {
                }
            }
        }
    });
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