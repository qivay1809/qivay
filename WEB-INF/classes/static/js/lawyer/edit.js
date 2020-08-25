var editVM = new Vue({
    el: '#editLawyer',
    data: {
        lawyerId: '',
        lawyerName: '',
        enName: '',
        lawyerDesc: '',
        lawyerOrder: '',
        lawyerShow: 1,
        lawyerType: 0,
        lawyerIcon: '',
        lawFirm: '',
        workYear: null,
        specialty: '',
        lawyerIconCompress: '',
        file: '',
        lawyers:[],
        userId:'',
        phone:'',
        uploadUrl: getUrl('fastdfs/uploadImages'),
        url: getUrl('lawyer/addLawyer')
    },
    methods: {
        editLawyer: function () {
            if (!this.lawyerName) {
                alert("请填写律师姓名!");
                return;
            }
            if (this.file) {
                this.lawyerIcon = this.file;
            }
            if (!this.lawyerIcon) {
                alert("请上传律师头像!");
                return;
            }
            if (!this.lawyerDesc) {
                alert("请填写律师简介!");
                return;
            }
            if (!this.lawyerOrder) {
                alert("请填写公告排序!");
                return;
            }
            if (this.workYear){
                if (isNaN(this.workYear)){
                    alert("工作年限必须是数字!");
                    return;
                }
            }
            if (this.lawyerDesc.indexOf("\n") > 0){
                this.lawyerDesc = this.lawyerDesc.replace(/\r\n/g,"<br/>");
                this.lawyerDesc = this.lawyerDesc.replace(/\n/g,"<br/>");
            }
            this.lawyerDesc = this.lawyerDesc.replace(/\s/g,"&emsp;");
            var lawyer = {
                lawyerName: this.lawyerName
                , enName: this.enName
                , lawyerDesc: this.lawyerDesc
                , lawFirm: this.lawFirm
                , workYear: this.workYear
                , specialty: this.specialty
                , lawyerOrder: this.lawyerOrder
                , lawyerShow: this.lawyerShow
                , lawyerType: this.lawyerType
                , lawyerIcon: this.lawyerIcon
                , lawyerId: this.lawyerId
                , userId: this.userId
                , phone: this.phone
            };
            if (this.lawyerId) {
                this.url = getUrl("lawyer/updateLawyer");
            }
            this.$http.post(this.url, lawyer, {emulateJSON: true})
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
        bindLawyer: function (id) {
            this.$http.post(getUrl('lawyer/getLawyer'), {lawyerId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var lawyer = response.data.obj;
                        this.lawyerId = lawyer.lawyerId;
                        this.lawyerName = lawyer.lawyerName;
                        this.enName = lawyer.enName;
                        this.lawyerOrder = lawyer.lawyerOrder;
                        this.lawyerDesc = lawyer.lawyerDesc;
                        this.lawyerShow = lawyer.lawyerShow;
                        this.lawyerType = lawyer.lawyerType;
                        this.lawyerIcon = lawyer.lawyerIcon;
                        this.lawFirm = lawyer.lawFirm;
                        this.workYear = lawyer.workYear;
                        this.specialty = lawyer.specialty;
                        this.lawyerIconCompress = lawyer.lawyerIconCompress;
                    }
                    else alert('服务器内部错误');
                })
        },
        findByUserType: function () {
            this.$http.post(getUrl('user/findByUserType'), {userType: 2}, {emulateJSON: true})
                .then(function (response) {
                    this.lawyers = response.data.obj;
                })
        }
    }
});

$(function () {
        var id = $("#hidLawyerId").val();
        if (id != null && id.length > 0) {
            editVM.bindLawyer(id);
        }
    editVM.findByUserType();
        $(".editClose").click(clearLawyerId);
    }
);