/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#regionIndex',
    data: {
        search: {regionName: '', provinceId: '', cityId: ''},
        provinces: [],
        cities: [],
        areas: [],
        regions: [],
        url: getUrl('region/getRegions')
    },
    methods: {
        getRegions: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var params = {
                regionName: this.search.regionName
                , provinceId: this.search.provinceId,cityId: this.search.cityId
                , pageIndex: pageVM.current_page, pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.regions = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
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

function setRegionId(regionId) {
    $('#hidRegionId').val(regionId);
}

function setRegionAndVerify(regionId, regionVerify) {
    $('#hidRegionId').val(regionId);
}

function clearRegionId() {
    $("#hidRegionId").val('');
}

$(function () {
        clearRegionId();
        app.getRegions();
        app.getProvinces();
    }
);