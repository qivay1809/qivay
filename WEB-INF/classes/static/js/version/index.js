/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#versionIndex',
    data: {
        search: {title: '', beginDate: '', endDate: ''},
        versions: [],
        url: getUrl('version/getVersions')
    },
    methods: {
        getVersions: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
                app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
                app.search.endDate = endDate;
            var params = {
                title: this.search.title,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.versions = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                })
        }

    }
});

function setVersionId(jobId) {
    $('#hidVersionId').val(jobId);
}

function clearVersionId() {
    $("#hidVersionId").val('');
}

$(function () {
    app.getVersions();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearVersionId();
});
