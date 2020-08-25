/**
 * Created by Administrator on 2018/12/26.
 */

var editAdminVM = new Vue({
    el: '#editAdmin',
    data: {
        admin: -1,
        remarks: []
    },
    methods: {
        getRemarks: function () {
            this.$http.post(getUrl('permission/getRemarks'), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.remarks = response.data.obj;
                    }
                    else alert('服务器内部错误');
                });


        },
        setAdmin: function () {
            if (this.admin==-1) {
                alert("请选择角色");
                return;
            }

            this.$http.post(getUrl('user/setAdmin'), {userId:$("#hidUserId").val(),admin:this.admin}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                    }
                    else alert('保存失败');
                })
        },
        bindUser: function (id) {
            this.$http.post(getUrl('user/findUser'), {userId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.admin = user.admin;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidUserId").val();
        if (id != null && id.length > 0) {
            editAdminVM.bindUser(id);
            editAdminVM.getRemarks();
        }
        $(".editClose").click(clearUserId);
    }
);
