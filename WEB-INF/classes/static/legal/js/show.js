/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#showLegal',
    data:{
        name:'',
        phone:'',
        categoryDisplay:'',
        address:'',
        typeDisplay:'',
        data:'',
        detail:'',
        validate:'',
        legalId:'',
        statusDisplay:'',
        cause:''//验证不通过原因，
    },
    methods: {
        bindfindLegalId: function (legalId) {
            this.$http.post(getUrl('legal/findById'), {legalId: legalId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var legal = response.data.obj;
                        this.name = legal.name;
                        this.phone = legal.phone;
                        this.categoryDisplay = legal.categoryDisplay;
                        this.typeDisplay = legal.typeDisplay;
                        this.address = legal.city + legal.street;
                        this.legalId = legal.legalId;
                        this.data = legal.data;
                        this.detail = legal.detail;
                        this.statusDisplay = legal.statusDisplay;
                        this.validate = legal.validate;
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyLegal: function (obj) {
            var msg = $(obj).data("msg");
            if (msg === 2) {
                if (!confirm("请确认本次操作：验证不通过！")) return;
            }
            var data = {legalId: this.legalId, validate: msg, cause: this.cause};
            this.$http.post(getUrl("legal/updateValidate"), data, {emulateJSON: true})
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
        var id = $("#hidLegalId").val();
        if (id != null && id.length > 0) {
            editVM.bindfindLegalId(id);
        }
        $(".editClose").click(clearLegalId);
    }
);