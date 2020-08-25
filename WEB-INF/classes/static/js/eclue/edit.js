/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editClue',
    data: {
        clueId: '',
        number: -1,
        serialNumber: '',
        product: '',
        brand: '',
        amount: '',
        address: '',
        shop: '',
        description: '',
        findTime: '',
        taskId: '',
        taskTitle: '',
        createTime: '',
        clueVerifyDisplay: '',
        reason: '',
        shopType: 0,
        shopTypeDisplay: '',
        content: '',
        images: [],
        former: [],
        url: getUrl('clue/auditClue')
    },
    methods: {
        bindClue: function (id) {
            this.$http.post(getUrl('clue/getEnterpriseClue'), {clueId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var clue = response.data.obj;
                        this.clueId = clue.clueId;
                        this.number = clue.number;
                        this.product = clue.product;
                        this.brand = clue.brand;
                        this.amount = clue.amount;
                        this.address = clue.address;
                        this.shop = clue.shop;
                        this.description = clue.description;
                        this.findTime = clue.findTime;
                        this.taskId = clue.taskId;
                        this.taskTitle = clue.taskTitle;
                        this.createTime = clue.createTime;
                        this.serialNumber = clue.serialNumber;
                        this.clueVerifyDisplay = clue.clueVerifyDisplay;
                        this.reason = clue.reason;
                        this.shopType = clue.shopType;
                        this.shopTypeDisplay = clue.shopTypeShow;
                        this.images = clue.clueCompressImages;
                        this.former = clue.clueImages;
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyClue: function (obj) {
            var msg = $(obj).data("msg");
            var data = {taskId: this.taskId, clueId: this.clueId, validate: msg, content: this.content};
            this.$http.post(getUrl("clue/verifyEnterpriseClue"), data, {emulateJSON: true})
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

function openImage(obj) {
    var index = $(obj).next().val();
    var image = editVM.former[index];
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize,500);
}

$(function () {
    var id = $("#hidClueId").val();
        if (id != null && id.length > 0) {
            editVM.bindClue(id);
        }
        $(".editClose").click(clearClueId);
    }
);