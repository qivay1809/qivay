/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editRegion',
    data: {
        provinceId: '',
        cityId: '',
        regionId: '',
        parentId: '',
        regionName: '',
        regionEnname: '',
        longitude: '',
        latitude: '',
        provinces: [],
        cities: [],
        url: getUrl('region/addRegion')
    },
    methods: {
        editRegion: function () {
            if (!this.regionId) {
                alert("请填写区码!");
                return;
            }
            if (!this.regionName) {
                alert("请填写区名!");
                return;
            }
            var regionId = '';
            if (this.cityId != '') {
                regionId = this.cityId;
            } else {
                regionId = this.provinceId;
            }
            var id = $("#hidRegionId").val();
            if (id != null && id.length > 0) {
                this.url = getUrl('region/updateRegion');
            }
            var region = {
                regionId: this.regionId
                , parentId: regionId
                , regionName: this.regionName
                , regionEnname: this.regionEnname
                , longitude: this.longitude
                , latitude: this.latitude
            };
            this.$http.post(this.url, region, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        bindRegion: function (id) {
            this.$http.post(getUrl('region/getRegion'), {regionId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var region = response.data.obj;
                        this.regionId = region.regionId;
                        this.parentId = region.parentId;
                        this.regionName = region.regionName;
                        this.regionEnname = region.regionEnname;
                        this.longitude = region.longitude;
                        this.latitude = region.latitude;
                        var parentId = region.parentId;
                        if (parentId) {
                            this.provinceId = parentId.substr(0, 2);
                            this.getAllSubrange(this.provinceId, true);
                        }
                        if (this.regionId.length >= 4) {
                            this.cityId = this.regionId.substr(0, 4);
                        }
                    }
                    else alert('服务器内部错误');
                })
        },
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
                        this.cities = response.data.obj;
                        if (!msg) {
                            this.cityId = '';
                        }
                    })
            }
        }
    }
});

$(function () {
        var id = $("#hidRegionId").val();
        editVM.getAllProvince();
        if (id != null && id.length > 0) {
            editVM.bindRegion(id);
        }
        $(".editClose").click(clearRegionId);

    }
);