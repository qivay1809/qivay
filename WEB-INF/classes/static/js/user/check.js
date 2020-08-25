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
        enterpriseName:'',
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
                        this.enterpriseName = user.enterpriseName;
                        if (user.lawyer != null) {
                            this.certificateId = user.lawyer.certificateId;
                            this.certificateDisplay = user.lawyer.certificateDisplay;
                            this.workYear = user.lawyer.workYear;
                        }
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
            editVM.bindUser(id);
        }
        $(".editClose").click(clearUserId);
    }
);