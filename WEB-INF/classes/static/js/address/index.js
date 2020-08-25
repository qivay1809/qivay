/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#addressIndex',
    data: {
        search: {street: '', provinceId: '', cityId: '', areaId: '', addressVerify: -1},
        provinces: [],
        cities: [],
        areas: [],
        addresses: [],
        beginIndex: 0,
        url: getUrl('address/getAddresses')
    },
    methods: {
        getAddresses: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                street: this.search.street
                , provinceId: this.search.provinceId,cityId: this.search.cityId,areaId: this.search.areaId, addressVerify: this.search.addressVerify
                , pageIndex: pageIndex, pageSize: pageSize
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.addresses = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
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

function setAddressId(addressId) {
    $('#hidAddressId').val(addressId);
}

function setAddressAndVerify(addressId, addressVerify) {
    $('#hidAddressId').val(addressId);
    $("#hidAddressVerify").val(addressVerify);
}

function clearAddressId() {
    $("#hidAddressId").val('');
    $("#hidAddressVerify").val('');
}

$(function () {
        clearAddressId();
        app.getAddresses();
        app.getProvinces();
    }
);

function del(addressId) {
    if (confirm("删除后不可恢复，确定要删除吗？")) {
        $.ajax({
            url: "/address/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "addressId": addressId
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