/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editComment',
    data: {
        commentId: '',
        commentTypeDisplay: '',
        objectId: '',
        content: '',
        status: -1,
        statusDisplay: '',
        commentShowDisplay: '',
        creator: '',
        createTimeDisplay: '',
        inputType: -1,
        images: [],
        imageCompresses: [],
        url: getUrl('comment/verifyComment')
    },
    methods: {
        verifyComment: function (msg) {
            var comment = {
                commentId: this.commentId
                , status: msg
            };
            this.$http.post(this.url, comment, {emulateJSON: true})
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
        bindComment: function (id) {
            this.$http.post(getUrl('comment/getComment'), {commentId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var comment = response.data.obj;
                        this.commentId = comment.commentId;
                        this.commentTypeDisplay = comment.commentTypeDisplay;
                        this.objectId = comment.objectId;
                        this.content = comment.content;
                        this.status = comment.status;
                        this.statusDisplay = comment.statusDisplay;
                        this.commentShowDisplay = comment.commentShowDisplay;
                        this.creator = comment.creator;
                        this.createTimeDisplay = comment.createTimeDisplay;
                        this.inputType = comment.inputType;
                        this.images = comment.images;
                        this.imageCompresses = comment.imageCompresses;
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
        var id = $("#hidCommentId").val();
        if (id != null && id.length > 0) {
            editVM.bindComment(id);
        }
        $(".editClose").click(clearCommentId());
    }
);