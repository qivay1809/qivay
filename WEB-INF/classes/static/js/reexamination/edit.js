/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editExamination',
    data: {
        examinationId: '',
        productName: '',
        brandName: '',
        quantity: '',
        amount: null,
        address: '',
        shopTypeDisplay: '',
        shopName: '',
        cellphone: '',
        findTimeDisplay: '',
        creator: '',
        createTimeDisplay: '',
        status: -1,
        statusDisplay: '',
        other: '',
        hasReturn: '',
        hasReturnDisplay: '',
        company: '',
        sheetNo: '',
        deliveryImage: '',
        reAmount: null,
        url: getUrl('examination/returnExamination')
    },
    methods: {
        returnExamination: function () {
            var examination = {
                examinationId: this.examinationId,
                reAmount: this.reAmount
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
        bindExamination: function (id) {
            this.$http.post(getUrl('examination/getExamination'), {examinationId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var examination = response.data.obj;
                        this.examinationId = examination.examinationId;
                        this.productName = examination.productId;
                        this.brandName = examination.brandId;
                        this.quantity = examination.quantity;
                        this.amount = examination.amount;
                        this.address = examination.address;
                        this.shopTypeDisplay = examination.shopTypeDisplay;
                        this.shopName = examination.shopName;
                        this.cellphone = examination.cellphone;
                        this.findTimeDisplay = examination.findTimeDisplay;
                        this.creator = examination.creator;
                        this.createTimeDisplay = examination.createTimeDisplay;
                        this.status = examination.status;
                        this.statusDisplay = examination.statusDisplay;
                        this.other = examination.other;
                        this.company = examination.company;
                        this.sheetNo = examination.sheetNo;
                        this.deliveryImage = examination.deliveryImage;
                        this.hasReturn = examination.hasReturn;
                        this.hasReturnDisplay = examination.hasReturnDisplay;
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