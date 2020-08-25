/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editExamination',
    data: {
        examinationId: '',
        description:'',
        product: '',
        brand: '',
        creator: '',
        createTime: '',
        status: -1,
        statusString: '',
        compressImages: '',

        images:'',
        file:'',
        //url: 'https://api.qivay.com:8443/examination/verify'
        url: getErpUrl("examination/verify")
        //url: 'http://192.168.1.66:18081/examination/verify'
    },
    methods: {
        verifyExamination: function (msg) {
            var description = this.description;
            if (msg == 2){
                if (!description){
                    alert("验证不通过时，请填写描述!");
                    return;
                }
            }else {
                description = "";
            }
            var examination = {
                examinationId: this.examinationId,
                status: msg,
                description: description
            };
            this.$http.post(this.url, examination, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('保存失败');
                })
        },
        verifyExaminationMs: function (msg) {
            var description = this.description;
            var examination = {
                examinationId: this.examinationId,
                status: msg,
                description: description,
                attachment: this.file
            };
            this.url = getUrl('examination/verifyExamination');
            this.$http.post(this.url, examination, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                        $('.close').click();
                    }
                    else alert('保存失败');
                })
        },
        bindExamination: function (id) {
            this.$http.post(getUrl('examination/getExamination'), {examinationId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var examination = response.data.obj;
                        this.examinationId = examination.examinationId;
                        this.product = examination.product;
                        this.brand = examination.brand;
                        this.creator = examination.creator;
                        this.createTime = examination.createTime;
                        this.status = examination.status;
                        this.statusString = examination.statusString;
                        this.compressImages = examination.compressImages;
                        this.examinationImages = examination.examinationImages;
                        this.images = examination.images;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});



$(function () {
        var id = $("#hidExaminationId").val();
        if (id != null && id.length > 0) {
            editVM.bindExamination(id);
        }
        $(".editClose").click(clearExaminationId());
    }
);