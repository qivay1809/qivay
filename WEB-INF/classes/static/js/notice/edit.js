/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editNotice',
    data: {
        noticeId: '',
        noticeTitle: '',
        noticeContent: '',
        noticeDesc: '',
        noticeOrder: '',
        noticeShow: 0,
        url: getUrl('notice/addNotice')
    },
    methods: {
        editNotice: function () {
            if (!this.noticeTitle) {
                alert("请填写公告标题!");
                return;
            }
            this.noticeContent = UE.getEditor('editor').getContent();
            if (!this.noticeContent) {
                alert("请填写公告内容!");
                return;
            }
            this.noticeDesc = UE.getEditor('editor').getContentTxt().substr(0, 190) + '...';
            if (!this.noticeOrder) {
                alert("请填写公告排序!");
                return;
            }
            var notice = {
                noticeTitle: this.noticeTitle
                , noticeContent: this.noticeContent
                , noticeOrder: this.noticeOrder
                , noticeDesc: this.noticeDesc
                , noticeId: this.noticeId
                , noticeShow: this.noticeShow
            };
            if (this.noticeId) {
                this.url = getUrl("notice/updateNotice");
            }
            this.$http.post(this.url, notice, {emulateJSON: true})
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
        bindNotice: function (id) {
            this.$http.post(getUrl('notice/getNotice'), {noticeId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var notice = response.data.obj;
                        this.noticeId = notice.noticeId;
                        this.noticeTitle = notice.noticeTitle;
                        this.noticeOrder = notice.noticeOrder;
                        this.noticeContent = notice.noticeContent;
                        this.noticeDesc = notice.noticeDesc;
                        this.noticeShow = notice.noticeShow;
                        setTimeout(function () {
                            UE.getEditor('editor').setContent(editVM.noticeContent);
                        },100);
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var ue = UE.getEditor('editor', {
            toolbars: [
                ['undo', 'redo', 'bold']
            ],
            autoHeightEnabled: false,
            autoFloatEnabled: false
        });
        var id = $("#hidNoticeId").val();
        if (id != null && id.length > 0) {
            editVM.bindNotice(id);
        }
        $(".editClose").click(clearNoticeId);
    }
);