/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editWeiXinQa',
    data: {
        qaId: '',
        question: '',
        answer: '',
        qaOrder: '',
        qaShow: 0,
        url: getUrl('weiXinQa/addWeiXinQa')
    },
    methods: {
        editWeiXinQa: function () {
            if (!this.question) {
                alert("请填写问题内容!");
                return;
            }
            this.answer = UE.getEditor('editor').getContent();
            if (!this.answer) {
                alert("请填写回答内容!");
                return;
            }
            if (this.qaId){
                this.url = getUrl("weiXinQa/updateWeiXinQa");
            }
            if (!this.qaOrder) {
                alert("请填写问答排序!");
                return;
            }
            var weiXinQa = {
                question: this.question
                , answer: this.answer
                , qaOrder: this.qaOrder
                , qaShow: this.qaShow
                , qaId: this.qaId
            };
            this.$http.post(this.url, weiXinQa, {emulateJSON: true})
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
        bindWeiXinQa: function (id) {
            this.$http.post(getUrl('weiXinQa/getWeiXinQa'), {qaId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var weiXinQa = response.data.obj;
                        this.qaId = weiXinQa.qaId;
                        this.question = weiXinQa.question;
                        if (weiXinQa.answer){
                            this.answer = weiXinQa.answer;
                        }
                        this.qaOrder = weiXinQa.qaOrder;
                        this.qaShow = weiXinQa.qaShow;
                        setTimeout(function () {
                            UE.getEditor('editor').setContent(editVM.answer);
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
        var id = $("#hidWeiXinQaId").val();
        if (id != null && id.length > 0) {
            editVM.bindWeiXinQa(id);
        }
        $(".editClose").click(clearWeiXinQaId);
    }
);