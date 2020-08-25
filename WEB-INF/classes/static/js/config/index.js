/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#configIndex',
    data: {
        search: {key: '', creator: '', content: '', beginDate: '', endDate: ''},
        configs: [],
        url: getUrl('config/getConfigs')
    },
    methods: {
        getConfigs: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            this.search.beginDate = $("#txtBeginDate").val();
            this.search.endDate = $("#txtEndDate").val();
            var params = {
                key: this.search.key
                , creator: this.search.creator, content: this.search.content
                , beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageVM.current_page, pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.configs = response.data.obj.rows;
                    $("#txtBeginDate").val(this.search.beginDate);
                    $("#txtEndDate").val(this.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);//要进行取整处理
                })
        }

    }
});

function setConfigId(configId) {
    $('#hidConfigId').val(configId);
}

function clearConfigId() {
    $("#hidConfigId").val('');
}

$(function () {
        $(".date").click(function () {
            WdatePicker();
        });
        app.getConfigs();
        clearConfigId();
    }
);