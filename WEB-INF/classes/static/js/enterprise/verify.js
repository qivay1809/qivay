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
        boss:'',
        phone:'',
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
                        this.boss = enterprise.boss;
                        this.phone = enterprise.phone;
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyEnterprise: function (obj) {
            var msg = $(obj).data("msg");
            var data = {enterpriseId: this.enterpriseId, enterpriseVerify: msg, content: this.content, userId: this.userId};
            var value =$(obj).val();
            if(confirm("请确认该操作："+value)) {
                this.$http.post(getUrl("enterprise/verifyEnterprise"), data, {emulateJSON: true})
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
        },
        auditEnterprise: function (id) {
            this.$http.post(getUrl("enterprise/auditEnterprise"), {enterpriseId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.bindEnterprise(id);
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
        var id = $("#hidEnterpriseId").val();
        if (id != null && id.length > 0) {
            editVM.auditEnterprise(id);
        }
        $(".editClose").click(clearEnterpriseId);

    }
);