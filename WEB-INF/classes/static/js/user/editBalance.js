/**
 * Created by Administrator on 2018/12/26.
 */

var editBalanceVM = new Vue({
    el: '#editBalance',
    data: {
        accountType: 3,
        reward: 0.0,
        remark: ''
    },
    methods: {
        addReward: function () {
            if (!this.reward) {
                alert("请填写奖金!");
                return;
            }
            if (!this.remark) {
                alert("请填写奖备注!");
                return;
            }
            if (this.accountType === -1) {
                alert("请选择账户类型");
                return;
            }
            var param = {
                userId: $("#hidUserId").val(),
                reward: this.reward,
                accountType: this.accountType,
                remark: this.remark
            };

            this.$http.post(getUrl('user/addReward'), param, {emulateJSON: true})
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
                        this.balance = user.balance;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        $(".editClose").click(clearUserId);
    }
);