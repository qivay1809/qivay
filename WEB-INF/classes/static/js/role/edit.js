/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editRole',
    data: {
        roleId: '',
        roleName: '',
        description: '',
        url: getUrl('role/addRole')
    },
    methods: {
        editRole: function () {
            if (this.roleId){
                this.url = getUrl('role/updateRole');
            }
            var params = {
                roleId: this.roleId
                , roleName: this.roleName
                , description: this.description
            };
            this.$http.post(this.url, params, {emulateJSON: true})
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
        bindRole: function (id) {
            this.$http.post(getUrl('role/getRole'), {roleId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var role = response.data.obj;
                        this.roleId = role.roleId;
                        this.roleName = role.roleName;
                        this.description = role.description;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidRoleId").val();
        if (id != null && id.length > 0) {
            editVM.bindRole(id);
        }
        $(".editClose").click(clearRoleId);

    }
);