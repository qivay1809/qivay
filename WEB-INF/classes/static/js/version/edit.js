/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editVersion',
    data: {
        versionId: '',
        title: '',
        note: '',
        number: '',
        url: getUrl('version/add')
    },
    methods: {
        editVersion: function () {
            if (!this.title) {
                alert("请填写标题!");
                return;
            }
            if (!this.number) {
                alert("请填写版本号!");
                return;
            }
            //this.note = UE.getEditor('editor').getContent();
            if (!this.note) {
                alert("请填写内容!");
                return;
            }
            var version = {
                title: this.title
                , note: this.note
                ,number:this.number
                , versionId: this.versionId
            };
            if (this.versionId) {
                this.url = getUrl("version/update");
            }
            this.$http.post(this.url, version, {emulateJSON: true})
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
        bindVersion: function (id) {
            this.$http.post(getUrl('version/getById'), {versionId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var version = response.data.obj;
                        this.versionId = version.versionId;
                        this.title = version.title;
                        this.note = version.note;
                        this.number = version.number;
                        /*setTimeout(function () {
                            UE.getEditor('editor').setContent(editVM.note);
                        },100);*/
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidVersionId").val();
        if (id != null && id.length > 0) {
            editVM.bindVersion(id);
        }
        $(".editClose").click(clearVersionId);
    }
);