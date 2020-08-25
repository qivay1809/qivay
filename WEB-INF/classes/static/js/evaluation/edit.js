/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editEvaluation',
    data: {
        evaluationId: '',
        content: '',
        status: -1,
        statusDisplay: '',
        description: '',
        likes: '',
        anonymousDisplay: '',
        images: [],
        imageCompresses: [],
        url: getUrl('evaluation/verifyEvaluation')
    },
    methods: {
        verifyEvaluation: function (msg) {
            var description = this.description;
            if (msg == 1 || msg == 2){
                description = "";
            }else {
                if (!description){
                    alert("请填写鉴定描述!");
                    return;
                }
            }
            var evaluation = {
                evaluationId: this.evaluationId
                , status: msg
                , description: description
            };
            this.$http.post(this.url, evaluation, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('保存失败');
                })
        },
        bindEvaluation: function (id) {
            this.$http.post(getUrl('evaluation/getEvaluation'), {evaluationId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var evaluation = response.data.obj;
                        this.evaluationId = evaluation.evaluationId;
                        this.content = evaluation.content;
                        this.status = evaluation.status;
                        this.statusDisplay = evaluation.statusDisplay;
                        this.description = evaluation.description;
                        this.likes = evaluation.likes;
                        this.anonymousDisplay = evaluation.anonymousDisplay;
                        this.images = evaluation.images;
                        this.imageCompresses = evaluation.imageCompresses;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

function openDialog(obj) {
    var index = $(obj).next().val();
    var image = editVM.images[index];
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize,500);
}

$(function () {
        var id = $("#hidEvaluationId").val();
        if (id != null && id.length > 0) {
            editVM.bindEvaluation(id);
        }
        $(".editClose").click(clearEvaluationId());
    }
);