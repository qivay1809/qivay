/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editClue',
    data: {
        clueId: '',
        number: -1,
        product: '',
        serialNumber: '',
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
        validate: 0,
        clueVerifyDisplay: '',
        reason: '',
        shopType: 0,
        shopTypeDisplay: '',
        content: '',
        approveUser: '',
        visible: 0,
        uploadUser: '',
        file: '',
        authorization:'',
        assignUser:'',
        result:'',
        images: [],
        assignImages:[],
        former: [],
        contractImages: [],
        contractImageString: '',
        //clueAgreementId: '',
        progress: 0,
        idCard:''
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
                        this.validate = clue.validate;
                        this.reason = clue.reason;
                        this.shopType = clue.shopType;
                        this.serialNumber = clue.serialNumber;
                        this.shopTypeDisplay = clue.shopTypeShow;
                        this.approveUser = clue.approveUser;
                        this.progress = clue.progress;
                        this.idCard = clue.idCard;
                        if (clue.taskId) {
                            this.taskTitle = clue.taskTitle;
                        } else {
                            this.taskTitle = "无";
                        }
                        if (clue.clueCompressImages[0]) {
                            this.images = clue.clueCompressImages;
                        } else {
                            this.images = clue.clueImages;
                        }
                        this.former = clue.clueImages;
                        this.assignImages = clue.assignImages;
                        this.result = clue.result;
                        this.authorization = clue.authorization;
                        this.assignUser = clue.assignUser;
                    }
                    else alert('服务器内部错误');
                });
            this.$http.post(getUrl('agreement/getClueAgreement'), {clueId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var agreement = response.data.obj;
                        if(agreement != null) {
                            this.clueAgreementId = agreement.clueAgreementId;
                            this.uploadUser = agreement.updateUser;
                            this.visible = agreement.visible;
                            this.progress=agreement.progress;
                            this.contractImages = agreement.clueAgreementImages;
                            this.contractImageString = agreement.images;
                        }
                    }
                    else alert('服务器内部错误');
                });

        },
        /*approve: function () {
            this.$http.post(getUrl('clue/approve'), {clueId: this.clueId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                        alert('批准成功');
                    }
                    else alert('服务器内部错误');
                })
        },
        uploadContract: function () {
            if(this.file=='')
                this.file=this.contractImageString+";";
            this.$http.post(getUrl('agreement/uploadContract'), {
               // clueAgreementId: this.clueAgreementId,
                clueId: this.clueId,
                images: this.file,
                //visible: this.visible
            }, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                        alert('上传成功');
                    }
                    else alert('服务器内部错误');
                })
        },*/
        publish: function () {
            this.$http.post(getUrl('case/updateProgress'), {clueId: this.clueId, progress: 1}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                        alert('发布成功');
                    }
                    else alert('服务器内部错误');
                })
        },
        clueAssign:function () {
            if (!this.authorization) {
                alert("请填写授权企业");
                return;
            }
            if (!this.result) {
                alert("请填写批复内容！");
                return;
            }
            var clueAssign = {
                clueId: this.clueId,
                authorization: this.authorization,
                result: this.result,
                images: this.file
            };

            this.$http.post(getUrl("clueAssign/updateAssign"), clueAssign, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        // $('#txtSearch').click();
                        // $('.close').click();
                    }
                    else alert('保存失败');
                })
        }
    }
});

function openDialog(obj, isClue) {
    var index = $(obj).next().val();
    var image = '';
    if (isClue)
        image = editVM.former[index];
    else
        image = editVM.contractImages[index];
    console.log(image);
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize, 500);
}

$(function () {
        var id = $("#hidClueId").val();
        if (id != null && id.length > 0) {
            editVM.bindClue(id);
        }
        $(".editClose").click(clearClueId);
    }
);