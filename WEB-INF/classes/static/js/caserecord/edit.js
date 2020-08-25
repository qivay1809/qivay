/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editRecord',
    data: {
        vendorName: '',
        vendorCaseId: '',
        unileverCaseId: '',
        caseType: 1,
        targetNameAddress:'',
        enforcementAuthority:'',
        officerInChargeContact:'',
        dateOfRaid:'',
        suspects:'',
        file: '',
        url: getUrl('caseRecord/add'),
        uploadUrl: getUrl("fastdfs/uploadImages")
    },
    methods: {
        editImage: function () {
            if (!this.vendorName) {
                alert("请填写供应商!");
                return;
            }
            if (this.file) {
                this.image = this.file;
            }
            if (!this.vendorCaseId) {
                alert("请填写供应商案件编号!");
                return;
            }
            if (!this.unileverCaseId) {
                alert("请填写品牌方!");
                return;
            }

            if (!this.targetNameAddress) {
                alert("请填写目标名字及地址!");
                return;
            }
            if (!this.enforcementAuthority) {
                alert("请填写执法单位!");
                return;
            }
            if (!this.officerInChargeContact) {
                alert("请填写执法负责人及联系方式!");
                return;
            }

            if (!this.dateOfRaid) {
                alert("请填写行动时间!");
                return;
            }

            if (!this.suspects) {
                alert("请填写犯罪嫌疑人!");
                return;
            }
            var caseRecord = {
                vendorName: this.vendorName,
                vendorCaseId: this.vendorCaseId,
                unileverCaseId: this.unileverCaseId,
                targetNameAddress: this.targetNameAddress,
                enforcementAuthority: this.enforcementAuthority,
                officerInChargeContact: this.officerInChargeContact,
                dateOfRaid: this.dateOfRaid,
                suspects: this.suspects
            };
            if (this.adImageId) {
                this.url = getUrl("adImage/updateImage");
            }
            this.$http.post(this.url, caseRecord, {emulateJSON: true})
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
        bindImage: function (id) {
            this.$http.post(getUrl('adImage/getImage'), {adImageId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var image = response.data.obj;
                        this.adImageId = image.adImageId;
                        this.imageName = image.imageName;
                        this.image = image.url;
                        this.imageCompress = image.imageCompress;
                        this.adOrder = image.adOrder;
                        this.adShow = image.adShow;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidImageId").val();
        if (id != null && id.length > 0) {
            editVM.bindImage(id);
        }
    $("#dateOfRaid").click(function () {
        WdatePicker();
    });
        $(".editClose").click(clearImageId());
    }
);