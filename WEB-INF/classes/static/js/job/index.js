/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#jobIndex',
    data: {
        search: {jobTitle: '', creator: '', beginDate: '', endDate: '', jobShow: -1},
        jobs: [],
        url: getUrl('job/getJobs')
    },
    methods: {
        getJobs: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                jobTitle: this.search.jobTitle
                ,
                jobShow:this.search.jobShow,
                creator: this.search.creator,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.jobs = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }

    }
});

function setJobId(jobId) {
    $('#hidJobId').val(jobId);
}

function clearJobId() {
    $("#hidJobId").val('');
}

$(function () {
    app.getJobs();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearJobId();
});
