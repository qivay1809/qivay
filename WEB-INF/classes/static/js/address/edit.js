/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editAddress',
    data: {
        provinceId: '',
        cityId: '',
        areaId: '',
        addressId: '',
        street: '',
        streetEn: '',
        longitude: '',
        latitude: '',
        addressVerifyDisplay: '',
        addressVerify: -1,
        verify: '',
        content: '',
        provinces: [],
        cities: [],
        areas: [],
        url: getUrl('address/updateAddress')
    },
    methods: {
        editAddress: function () {
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
            if (!this.street) {
                alert("请填写街道信息!");
                return;
            }
            var address = {
                addressId: this.addressId
                , regionId: regionId
                , street: this.street
                , streetEn: this.streetEn
                , longitude: this.longitude
                , latitude: this.latitude
                , addressVerify: this.addressVerify
            };
            this.$http.post(this.url, address, {emulateJSON: true})
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
        bindAddress: function (id) {
            this.$http.post(getUrl('address/getAddress'), {addressId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var address = response.data.obj;
                        this.addressId = address.addressId;
                        this.street = address.street;
                        this.streetEn = address.streetEn;
                        this.longitude = address.longitude;
                        this.latitude = address.latitude;
                        this.addressVerify = address.addressVerify;
                        this.addressVerifyDisplay = address.addressVerifyDisplay;
                        var regionId = address.regionId;
                        if (regionId != '') {
                            this.provinceId = regionId.substr(0, 2);
                            this.getAllSubrange(this.provinceId, true);
                        }
                        if (regionId.length >= 4) {
                            this.cityId = regionId.substr(0, 4);
                            this.getAllSubrange(this.cityId, true);
                        }
                        if (regionId.length > 4) {
                            this.areaId = regionId;
                        }
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyAddress: function (obj) {
            var msg = $(obj).data("msg");
            var data = {addressId: this.addressId, addressVerify: msg, content: this.content};
            var value =$(obj).val();
            if(confirm("请确认该操作："+value)) {
                this.$http.post(getUrl("address/verifyAddress"), data, {emulateJSON: true})
                    .then(function (response) {
                        if (response.data.code === 200) {
                            $('#txtSearch').click();
                            $('.close').click();
                        } else if (response.data.code === 403) {
                            alert(response.data.msg);
                            $('#txtSearch').click();
                            $('.close').click();
                        }
                        else alert('验证失败');
                    })
            }
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
        }
    }
});

$(function () {
        var id = $("#hidAddressId").val();
        editVM.getAllProvince();
        if (id != null && id.length > 0) {
            editVM.bindAddress(id);
            var verify = $("#hidAddressVerify").val();
            editVM.verify = verify;
        }
        $(".editClose").click(clearAddressId);

    }
);