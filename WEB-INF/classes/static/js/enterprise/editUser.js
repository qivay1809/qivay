var editUserVM = new Vue({
    el: '#editUser',
    data: {
        enterpriseId: '',
        userId: '',
        userType: '',
        email: '',
        name: '',
        password: '',
        position: '',
        department: '',
        gender: 0,
        isEdit: false,
        url: getUrl('user/editEnterpriseUser')
    },
    methods: {
        editUser: function () {
            if (!this.name || !this.email || !this.position || !this.department) {
                alert("请填写星号标记内容");
                return;
            }

            if (!this.userId) {
                if (!this.password) {
                    alert("请填写密码!");
                    return;
                }
            }
            if(this.password){
                if(confirm("请确认密码："+ this.password)) {

                } else {
                    return;
                }
            }

            var user = {
                email: this.email
                , password: this.password
                , name: this.name
                , gender: this.gender
                , position: this.position
                , department: this.department
                , userId: this.userId
                , enterpriseId: request("id")
                , userType: parseInt(request("type"))
            };


            this.$http.post(this.url, user, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败' + response.data.msg);
                })
            //}
        },
        bindUser: function (id) {
            this.$http.post(getUrl('user/findUser'), {userId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.email = user.email;
                        this.userId = user.userId;
                        this.gender = user.gender;
                        this.name = user.name;
                        this.department = user.department;
                        this.position = user.position;
                        this.isEdit = true;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidUserId").val();
        if (id != null && id.length > 0) {
            // $('#divPassword').hide();
            editUserVM.bindUser(id);
        }
        $(".editClose").click(clearUserId);
    }
);