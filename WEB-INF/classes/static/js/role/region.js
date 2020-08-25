/**
 * Created by Administrator on 2017/11/17.
 */
var permissionVM = new Vue({
    el: '#selectDataType',
    data: {
        provinceId: '',
        cityId: '',
        areaId: '',
        provinces: [],
        cities: [],
        areas: [],
        url: getUrl('role/addPermissions')
    },
    methods: {
        getAllProvince: function () {
            this.$http.post(getUrl('region/getProvinces'), {emulateJSON: true})
                .then(function (response) {
                    this.provinces = response.data.obj;
                })
        },
        getAllSubrange: function (id, msg) {
            if (id) {
                this.$http.post(getUrl('region/getChildes'), {regionId: id}, {emulateJSON: true})
                    .then(function (response) {
                        if (id.length <= 3) {
                            this.cities = response.data.obj;
                            this.areas = [];
                            if (!msg) {
                                this.cityId = '';
                            }
                        } else {
                            this.areas = response.data.obj;
                        }
                        if (!msg) {
                            this.areaId = '';
                        }
                    })
            }
        },
        addPermission: function () {
            var regionId = '';
            if (this.areaId != '') {
                regionId = this.areaId;
            } else if (this.cityId != '') {
                regionId = this.cityId;
            } else {
                regionId = this.provinceId;
            }
            if (!regionId) {
                alert("请选择地区!");
                return;
            }
            var roleId = $("#hidRoleId").val();
            var dataType = $("#dataType").val();
            var objectIds = [regionId];
            var params = {
                roleId: roleId,
                objectIds: JSON.stringify(objectIds),
                dataType: dataType
            };
            this.$http.post(this.url,params, {emulateJSON: true}).then(function (response) {
                if (response.data.code === 200) {
                    $('#btnClose').click();
                }
                else alert('保存失败');
            })
        }
    }
});


$(function () {
        permissionVM.getAllProvince();
    }
);