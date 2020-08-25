/**
 * Created by Administrator on 2017/11/17.
 */

var editJobVM = new Vue({
    el: '#editJob',
    data: {
        jobId: '',
        jobTitle: '',
        jobDesc: '',
        jobRequire: '',
        jobOrder: '',
        jobShow: 0,
        url: getUrl('job/addJob')
    },
    methods: {
        editJob: function () {
            if (!this.jobTitle) {
                alert("请填写招聘标题!");
                return;
            }
            if (!this.jobDesc) {
                alert("请填写招聘描述!");
                return;
            }
            if (!this.jobRequire) {
                alert("请填写招聘需求!");
                return;
            }
            if (!this.jobOrder) {
                alert("请填写招聘排序!");
                return;
            }
            var job = {
                jobTitle: this.jobTitle
                , jobDesc: this.jobDesc
                , jobRequire: this.jobRequire
                , jobOrder: this.jobOrder
                , jobShow: this.jobShow
                , jobId: this.jobId
            };
            var url = this.url;
            if (this.jobId) {
                url = getUrl("job/updateJob");
            }
            this.$http.post(url, job, {emulateJSON: true})
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
        bindJob: function (id) {
            this.$http.post(getUrl('job/getJob'), {jobId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var job = response.data.obj;
                        this.jobId = job.jobId;
                        this.jobTitle = job.jobTitle;
                        this.jobDesc = job.jobDesc;
                        this.jobRequire = job.jobRequire;
                        this.jobOrder = job.jobOrder;
                        this.jobShow = job.jobShow;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidJobId").val();
        if (id != null && id.length > 0) {
            editJobVM.bindJob(id);
        }
        $(".editClose").click(clearJobId);
    }
);