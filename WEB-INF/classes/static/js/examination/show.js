/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editExamination',
    width: '900px',
    data: {
        expresss:[],
        examinationId: '',
        description:'',
        product: '',
        brand: '',
        creator: '',
        createTime: '',
        status: -1,
        statusString: '',
        compressImages: '',
        examinationImages: '',
        Attachment:''
    },
    methods: {
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
                        this.Attachment = examination.attachment;
                    }
                    else alert('服务器内部错误');
                })
        },
        getExpress: function (id) {
            this.url = getUrl('examination/getExpress');
            this.$http.post(this.url,{examinationId: id}, {emulateJSON: true})
                .then(function (response) {
                    this.expresss = response.data.obj;
                })
        }
    }
});

function openDialog(obj) {
    var index = $(obj).next().val();
    var image = editVM.former[index];
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize,500);
}

$(function () {
        var id = $("#hidExaminationId").val();
        if (id != null && id.length > 0) {
            editVM.bindExamination(id);
            editVM.getExpress(id);
        }
        $(".editClose").click(clearExaminationId());
    }
);