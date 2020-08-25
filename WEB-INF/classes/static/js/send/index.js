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
            sendState: -1,
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
        url: getUrl('clue/getSendClues')
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
                clueId: this.search.clueId,
                hasTask: this.search.hasTask,
                shopType: this.search.shopType,
                sendState: this.search.sendState
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
                    clearCheckBox();
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

function clearCheckBox() {
    $(':checkbox').prop("checked",false);
}

function selectAll() {
    $("td :checkbox").prop("checked",$("#myCheckBox").prop("checked"));
}

function setSendType(msg) {
    if ($('input[type=checkbox]:checked').length < 1){
        alert("请选择复选框!");
        return;
    }
    $('#sendType').val(msg);
    $('#sendBatch').click();
}


function setClueId(clueId) {
    $('#hidClueId').val(clueId);
    $('#sendType').val("single");
}


function clearClueId() {
    $("#hidClueId").val('');
    $('#sendType').val('');
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