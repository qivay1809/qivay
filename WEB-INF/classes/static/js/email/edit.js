/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editEmail',
    data: {
        emailId: '',
        emailName: '',
        emailAddress: '',
        url: getUrl('email/addEmail')
    },
    methods: {
        editEmail: function () {
            if (!this.emailAddress) {
             alert("请填写邮箱地址!");
             return;
             }
            if (!this.emailName) {
                alert("请填写对应机构!");
                return;
            }
            var email = {
                emailId: this.emailId
                , emailName: this.emailName
                , emailAddress: this.emailAddress
            };
            var id = $("#hidEmailId").val();
            if (id != null && id.length > 0) {
                this.url = getUrl('email/updateEmail');
                email.emailId = id;
            }
            this.$http.post(this.url, email, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        bindEmail: function (id) {
            this.$http.post(getUrl('email/getEmail'), {emailId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var email = response.data.obj;
                        this.emailId = email.emailId;
                        this.emailName = email.emailName;
                        this.emailAddress = email.emailAddress;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidEmailId").val();
        if (id != null && id.length > 0) {
            $(".modal-backdrop").remove();
            editVM.bindEmail(id);
        }
        $(".editClose").click(clearEmailId);

    }
);