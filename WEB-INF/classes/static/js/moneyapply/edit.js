/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#checkApply',
    data: {
        validate: '',
        applyId:'',
        remark:'',
        //url:'https://api.qivay.com:8443/transfer/withdrawVerify'
        //url:'http://192.168.1.66:18081/transfer/withdrawVerify'
        url:getErpUrl("transfer/withdrawVerify")
    },
    methods: {
        bindId:function(id){
            this.applyId = id;
        },

        verify: function (obj) {
            var msg = $(obj).data("msg");
            if (msg != 1 && !this.remark) {
                alert("验证不通过，请先填写说明！");
                return;
            }
            var str = '';
            if(msg == 1){
                str = '通过';
            } else {
                str = '不通过';
            }


            if(!confirm('操作确认:'+ str)) return;
            var data = {moneyApplyId: this.applyId, validate: msg, remark: this.remark};
            $.ajaxSettings.async = false;
            this.$http.post(this.url, data, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.checkClose').click();
                    } else if (response.data.code === 313) {
                        var msg = response.data.msg;
                        alert(msg);
                        $('#txtSearch').click();
                        if(msg == '未通过'){
                            $('.checkClose').click();
                        }
                    }
                    else alert('保存失败');
                });
            $.ajaxSettings.async = true;
        }
    }
});

$(function () {
        var id = $("#hidApplyId").val();
        if (id != null && id.length > 0) {
            editVM.bindId(id);
        }
        $(".checkClose").click(clearApplyId);
    }
);