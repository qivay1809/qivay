/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editUser',
    data: {
        userId: '',
        name: '',
        genderDisplay: '',
        idCard: '',
        idCardFront: '',
        idCardBack: '',
        holdIdCard: '',
        userType: '',
        userTypeDisplay: '',
        certificateId: '',
        certificateDisplay: [],
        workYear: -1,
        userState: -1,
        userStateDisplay: '',
        content: '',
        url: getUrl('user/verifyUser')
    },
    methods: {
        bindUser: function (id) {
            this.$http.post(getUrl('user/findUser'), {userId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.userId = user.userId;
                        this.name = user.name;
                        this.idCard = user.idCard;
                        this.idCardFront = user.idCardFront;
                        this.idCardBack = user.idCardBack;
                        this.holdIdCard = user.holdIdCard;
                        this.genderDisplay = user.genderDisplay;
                        this.userType = user.userType;
                        this.userTypeDisplay = user.userTypeDisplay;
                        this.userState = user.userState;
                        this.userStateDisplay = user.userStateDisplay;
                        if (user.lawyer != null) {
                            this.certificateId = user.lawyer.certificateId;
                            this.certificateDisplay = user.lawyer.certificateDisplay;
                            this.workYear = user.lawyer.workYear;
                        }
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyUser: function (obj) {
            var msg = $(obj).data("msg");

            if (msg === 2) {
                if (!confirm("请确认本次操作：验证不通过！")) return;
            }
            var data = {userId: this.userId, userState: msg, content: this.content};
            this.$http.post(getUrl("user/verifyUser"), data, {emulateJSON: true})
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
        },
        userAudit: function (id) {
            this.$http.post(getUrl('user/userAudit'), {userId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.bindUser(id);
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

function openImage(obj) {
    var image = $(obj).attr("src");
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize,500);
}

$(function () {
        var id = $("#hidUserId").val();
        if (id != null && id.length > 0) {
            editVM.userAudit(id);
        }
        $(".editClose").click(clearUserId);
    }
);