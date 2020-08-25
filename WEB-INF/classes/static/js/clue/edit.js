/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editClue',
    data: {
        encourage: 0,
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
        userName: '',
        cellphone: '',
        createTime: '',
        taskTitle: '',
        clueVerifyDisplay: '',
        content: '',
        reason: '',
        shopType: 0,
        shopTypeDisplay: '',
        images: [],
        former: [],
        url: getUrl('clue/auditClue')
    },
    methods: {
        bindClue: function (id) {
            this.$http.post(getUrl('clue/getClue'), {clueId: id}, {emulateJSON: true})
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
                        this.userName = clue.userName;
                        this.cellphone = clue.cellphone;
                        this.createTime = clue.createTime;
                        this.clueVerifyDisplay = clue.clueVerifyDisplay;
                        this.reason = clue.reason;
                        this.shopType = clue.shopType;
                        this.serialNumber = clue.serialNumber;
                        this.shopTypeDisplay = clue.shopTypeShow;
                        if (clue.taskId){
                            this.taskTitle = clue.taskTitle;
                        }else{
                            this.taskTitle = "无";
                        }
                        if (clue.clueCompressImages[0]) {
                            this.images = clue.clueCompressImages;
                        } else {
                            this.images = clue.clueImages;
                        }
                        this.former = clue.clueImages;
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyClue: function (obj) {
            var msg = $(obj).data("msg");
            if (!this.content) {
                alert("请填写验证说明!");
                return;
            }
            var data = {clueId: this.clueId, validate: msg, content: this.content, encourage:this.encourage};
            var value =$(obj).val();
            if(confirm("确认该操作："+value)){
                this.$http.post(getUrl("clue/verifyClue"), data, {emulateJSON: true})
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
        var id = $("#hidClueId").val();
        if (id != null && id.length > 0) {
            editVM.bindClue(id);
        }
        $(".editClose").click(clearClueId);
    }
);