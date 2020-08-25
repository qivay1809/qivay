/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editAmount',
    data: {
        accountType: 1,
        amount: 0
    },
    methods: {
        insertAmount: function () {
            if (!this.amount) {
                alert("请输入金额！");
                return;
            }
            this.$http.post(getUrl('money/insertMoneyTransfer'), {accountType: this.accountType, amount: this.amount}, {emulateJSON: true})
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
        }
    }
});

$(function () {
        editVM.insertAmount();
    }
);