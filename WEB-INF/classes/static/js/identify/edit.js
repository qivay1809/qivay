/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editIdentify',
    data: {
        identifyId: '',
        title: '',
        description: '',
        content: '',
        identifyOrder: '',
        identifyShow: 0,
        url: getUrl('identify/addIdentify')
    },
    methods: {
        editIdentify: function () {
            if (!this.title) {
                alert("请填写真假标题!");
                return;
            }
            if (!this.description) {
                alert("请填写真假简介!");
                return;
            }
            this.content = UE.getEditor('editor').getContent();
            if (!this.content) {
                alert("请填写真假内容!");
                return;
            }
            if (!this.identifyOrder) {
                alert("请填写真假排序!");
                return;
            }
            var identify = {
                title: this.title
                , content: this.content
                , identifyOrder: this.identifyOrder
                , description: this.description
                , identifyId: this.identifyId
                , identifyShow: this.identifyShow
            };
            if (this.identifyId) {
                this.url = getUrl("identify/updateIdentify");
            }
            this.$http.post(this.url, identify, {emulateJSON: true})
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
        bindIdentify: function (id) {
            this.$http.post(getUrl('identify/getIdentify'), {identifyId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var identify = response.data.obj;
                        this.identifyId = identify.identifyId;
                        this.title = identify.title;
                        this.identifyOrder = identify.identifyOrder;
                        this.content = identify.content;
                        this.description = identify.description;
                        this.identifyShow = identify.identifyShow;
                        setTimeout(function () {
                            UE.getEditor('editor').setContent(editVM.content);
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
                ['undo', 'redo', 'bold','simpleupload']
            ],
            autoHeightEnabled: false,
            autoFloatEnabled: false
        });
        UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
        UE.Editor.prototype.getActionUrl = function(action) {
            if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
                return getUrl("/fastdfs/imgUpload"); //在这里返回我们实际的上传图片地址
            } else {
                return this._bkGetActionUrl.call(this, action);
            }
        };
        var id = $("#hidIdentifyId").val();
        if (id != null && id.length > 0) {
            editVM.bindIdentify(id);
        }
        $(".editClose").click(clearIdentifyId);
    }
);