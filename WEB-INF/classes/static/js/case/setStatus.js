var editVM = new Vue({
    el: '#updateStatus',
    data: {
        status:-1,
    },
    methods: {
        updateStatus: function () {
            if (this.status==-1) {
                alert("请选择进度");
                return;
            }

            this.$http.post(getUrl("case/updateStatus"), {caseId: $("#hidCaseId").val(),status:this.status}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                    }
                    else alert('保存失败');
                })
        },
        bindStatus: function (id) {
            this.$http.post(getUrl('case/getCase'), {caseId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var caseInfo = response.data.obj;
                        this.status = caseInfo.status;
                    }
                    else alert('服务器内部错误');
                })
        }

    }
});



$(function () {

        var id = $("#hidCaseId").val();
        if (id != null && id.length > 0) {
            editVM.bindStatus(id);
        }
        $(".editClose").click(clearCaseId);
    }
);