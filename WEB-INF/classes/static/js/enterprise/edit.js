

var editVM = new Vue({
    el: '#editEnterprise',
    data: {
        enterpriseId: '',
        enterpriseName: '',
        certificateId:'',
        compressImage: '',
        file: '',
        enterpriseType:'',
        introduction: '',
        address: '',
        //name: '',
        //gender: 0,
        //position: '',
        //password:'',
        //cellphone:'',
        //userId:'',
        boss:'',
        phone:'',
        isEdit:false,
        url: getUrl('enterprise/editEnterprise')
    },
    methods: {
        editEnterprise: function () {
            if (!this.enterpriseName ||!this.certificateId||!this.enterpriseType||!this.introduction
                ||!this.address||!this.boss||!this.phone) {
                alert("请填写带星号内容");
                return;
            }

            var enterprise = {
                enterpriseId: this.enterpriseId
                ,enterpriseName: this.enterpriseName
                , certificateId: this.certificateId
                , certificate: this.file
                , enterpriseType: this.enterpriseType
                , introduction: this.introduction
                , address: this.address
                , enterpriseId: this.enterpriseId,
                boss: this.boss,
                phone: this.phone,
                /*name:this.name,
                gender:this.gender,
                position:this.position,
                password:this.password,
                cellphone:this.cellphone,
                userId:this.userId*/
            };

            this.$http.post(this.url, enterprise, {emulateJSON: true})
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
        },
        bindEnterprise: function (id) {
            this.$http.post(getUrl('enterprise/getEnterprise'), {enterpriseId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var enterprise = response.data.obj;
                        this.enterpriseId = enterprise.enterpriseId;
                        this.enterpriseName = enterprise.enterpriseName;
                        this.file = enterprise.certificate;
                        this.compressImage = enterprise.compressImage;
                        this.certificateId = enterprise.certificateId;
                        this.introduction = enterprise.introduction;
                        this.address = enterprise.address;
                        this.enterpriseType = enterprise.enterpriseType;
                        //this.name=enterprise.name;
                        //this.gender=enterprise.gender;
                        //this.position=enterprise.position;
                        //this.cellphone=enterprise.cellphone;
                        //this.userId=enterprise.userId;
                        this.boss = enterprise.boss;
                        this.phone = enterprise.phone;
                        this.compressImage=enterprise.compressImage;
                        this.isEdit=true;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

function openDialog(obj) {
    var image = $(obj).attr("src");
    // alert(image);
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize, 500);
}

$(function () {
        var id = $("#hidEnterpriseId").val();
        if (id != null && id.length > 0) {
            editVM.bindEnterprise(id);
        }
        $(".editClose").click(clearEnterpriseId);
    }
);