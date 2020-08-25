/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#showUnbind',
    data:{
        name:'',
        phone:'',
        accountTypeDisplay:'',
        stateDisplay:'',
        state:'',
        idCard:'',
        cause_x:'',
        unbindId:'',
        cause:''//验证不通过原因
    },
    methods: {
        bindfindUnbindId: function (unbindId) {
            this.$http.post(getUrl('unbind/findById'), {unbindId: unbindId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var unbind = response.data.obj;
                        this.name = unbind.name;
                        this.phone = unbind.phone;
                        this.accountTypeDisplay = unbind.accountTypeDisplay;
                        this.stateDisplay = unbind.stateDisplay;
                        this.idCard = unbind.idCard;
                        this.unbindId = unbind.unbindId;
                        this.state = unbind.state;
                        this.cause_x = unbind.cause;
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyUnbind: function (obj) {
            var msg = $(obj).data("msg");
            if (msg === 2) {
                if (!confirm("请确认本次操作：验证不通过！")) return;
            }
            var data = {unbindId: this.unbindId, state: msg, cause: this.cause};
            this.$http.post(getUrl("unbind/updateStatus"), data, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('验证失败');
                })
        }
    }
});

$(function () {
        var id = $("#hidUnbindId").val();
        if (id != null && id.length > 0) {
            editVM.bindfindUnbindId(id);
        }
        $(".editClose").click(clearUnbindId);
    }
);