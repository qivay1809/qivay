/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#clueIndex',
    data: {
        search: {
            roleId: '',
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
        clueIds: [],
        beginIndex: 0,
        params: [],
        url: getUrl('clue/getRoleClues')
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
                participantPageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var pageIndex = participantPageVM.current_page;
            var pageSize = 10;
            var params = {
                regionId: regionId
                ,
                roleId: this.search.roleId
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
                    participantPageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
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
        },
        addPermissions: function () {
            $.confirm({
                title: '添加权限',
                content: '<h4>您确定要添加吗？</h4>',
                buttons: {
                    '确定': {
                        btnClass: 'btn-primary',
                        action: function () {
                            $('td input[type=checkbox]:checked').each(function () {
                                app.clueIds.push($(this).val());
                            });
                            if (app.clueIds.length < 1){
                                alert("请选择复选框!");
                                return;
                            }
                            var params = {
                                roleId: app.search.roleId,
                                dataType: $("#dataType").val(),
                                objectIds: JSON.stringify(app.clueIds)
                            };
                            app.$http.post(getUrl('role/addPermissions'),params, {emulateJSON: true}).then(function (response) {
                                if (response.data.code === 200) {
                                    $('#btnSearch2').click();
                                }
                                else alert('保存失败');
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

    }
});

function clearCheckBox() {
    $(':checkbox').prop("checked",false);
}

function selectAll() {
    $("td :checkbox").prop("checked",$("#myCheckBox").prop("checked"));
}



$(function () {
        app.search.roleId = $("#hidRoleId").val();
        app.getClues();
        app.getProvinces();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);