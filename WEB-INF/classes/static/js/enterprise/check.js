/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editEnterprise',
    data: {
        enterpriseId: '',
        enterpriseName: '',
        address: '',
        introduction: '',
        certificateId: '',
        certificateDisplay: [],
        userId: '',
        name: '',
        position: '',
        genderDisplay: '',
        cellphone: '',
        enterpriseVerify: -1,
        enterpriseVerifyDisplay: '',
        content: '',
        url: getUrl('enterprise/auditEnterprise')
    },
    methods: {
        bindEnterprise: function (id) {
            this.$http.post(getUrl('enterprise/getEnterprise'), {enterpriseId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var enterprise = response.data.obj;
                        this.enterpriseId = enterprise.enterpriseId;
                        this.enterpriseName = enterprise.enterpriseName;
                        this.address = enterprise.address;
                        this.introduction = enterprise.introduction;
                        this.certificateId = enterprise.certificateId;
                        this.certificateDisplay = enterprise.certificateDisplay;
                        this.userId = enterprise.userId;
                        this.name = enterprise.name;
                        this.position = enterprise.position;
                        this.genderDisplay = enterprise.genderDisplay;
                        this.cellphone = enterprise.cellphone;
                        this.enterpriseVerify = enterprise.enterpriseVerify;
                        this.enterpriseVerifyDisplay = enterprise.enterpriseVerifyDisplay;
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
        var id = $("#hidEnterpriseId").val();
        if (id != null && id.length > 0) {
            editVM.bindEnterprise(id);
        }
        $(".editClose").click(clearEnterpriseId);

    }
);