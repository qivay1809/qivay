/**
 * Created by Administrator on 2017/11/17.
 */
var participantVM = new Vue({
    el: '#participant',
    data: {
        search: {roleId: ''},
        participants: [],
        beginIndex: 0,
        url: getUrl('role/getUsersByRoleId')
    },
    methods: {
        getParticipants: function () {
            var params = {
                roleId: this.search.roleId
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.participants = response.data.obj;
                })
        }

    }
});

function deleteUser(userId) {
    $.confirm({
        title: '删除用户',
        content: '<h4>您确定要删除吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    var params = {
                        roleId: $("#hidRoleId").val(),
                        userId: userId
                    };
                    app.$http.post(getUrl('role/deleteRoleUser'),params, {emulateJSON: true}).then(function (response) {
                        if (response.data.code === 200) {
                            participantVM.getParticipants();
                        }
                        else alert('保存失败');
                    })
                }
            },
            '取消': {
                btnClass: 'btn-default',
                action: function () {
                }
            }
        }
    });
}


$(function () {
        var id = $("#hidRoleId").val();
        participantVM.search.roleId = id;
        participantVM.getParticipants();
    }
);