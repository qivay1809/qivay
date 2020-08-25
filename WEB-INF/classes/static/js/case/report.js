var app = new Vue({
    el: '#caseReportIndex',
    data: {
        caseId:'',
        caseReports: [],
        beginIndex: 0,
        params: [],
        url: getUrl('caseReport/getCaseReports'),
        
    },
    methods: {
        getCaseReports: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var pageIndex = pageVM.current_page;
            var pageSize = 5;
            var params = {
                caseId: request("id"),pageIndex: pageIndex, pageSize: pageSize
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.caseReports = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;

                })
        },
        audit:function (reportId,status) {

            var params = {
                caseReportId: reportId,status: status, progress: $('#sel'+reportId).val(),message:$('#'+reportId).val(),creator:$('#hid'+reportId).val()
            };
            if(status==2 && !params.message){
                alert('请填写不通过原因');
                return;
            }

            this.$http.post(getUrl('caseReport/audit'), params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        alert("审核成功");
                        $("#txtSearch").click();
                    }

                })
        }


    }
});

function openDialog(obj) {
    var image = $(obj).attr("src");
    // alert(image);
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize, 500);
}


$(function () {
        app.getCaseReports();
    }
);
