var editVM = new Vue({
    el: '#editCase',
    data: {
        caseId: '',
        caseTitle: '',
        caseContent: '',
        brandId: '',
        brandName: '',
        product: '',
        progress: 0,
        region: '',
        industry: '',
        reward: '',
        // deadline: '',
        file: '',
        images:'',
        caseImages: [],
        url: getUrl('case/addCase'),
        uploadUrl: getUrl("fastdfs/uploadImages")
    },
    methods: {
        editCase: function () {
            if (!this.caseTitle) {
                alert("请填写案件标题");
                return;
            }
            if (!this.brandName) {
                alert("请填写品牌");
                return;
            }
            //this.caseContent = UE.getEditor('editor').getContent();
            if (!this.caseContent) {
                alert("请填写案件内容");
                return;
            }
            if(this.file=='')
                this.file=this.images+";";
            var caseInfo = {
                caseTitle: this.caseTitle
                , caseContent: this.caseContent
                , brandName: this.brandName
                , caseId: this.caseId
                , product: this.product
                , region: this.region
                , industry: this.industry
                , reward: this.reward
                , deadline: $("#txtDeadline").val()
                ,images: this.file
            };

            if (this.caseId) {
                this.url = getUrl("case/updateCase");
            }
            this.$http.post(this.url, caseInfo, {emulateJSON: true})
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
        },
        bindCase: function (id) {
            this.$http.post(getUrl('case/getCase'), {caseId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var caseInfo = response.data.obj;
                        this.caseId = caseInfo.caseId;
                        this.caseTitle = caseInfo.caseTitle;
                        this.caseContent = caseInfo.caseContent;
                        this.brandId = caseInfo.brandId;
                        this.brandName = caseInfo.brandName;
                        this.progress = caseInfo.progress;
                        this.product = caseInfo.product;
                        this.region = caseInfo.region;
                        this.industry = caseInfo.industry;
                        this.reward = caseInfo.reward;
                        this.caseImages=caseInfo.caseImages;
                        this.images=caseInfo.images;
                        $("#txtDeadline").val(caseInfo.deadline);
                        /*setTimeout(function () {
                            UE.getEditor('editor').setContent(editVM.caseContent);
                        }, 100);*/
                        $("#textSearch").val(this.brandName);
                    }
                    else alert('服务器内部错误');
                })
        },
        publish: function () {
            if(!confirm('确定发布？')) return;

            this.$http.post(getUrl('case/startCase'), {caseId: this.caseId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('.close').click();
                        alert('发布成功');
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

function setTypeAhead() {
    $('#textSearch').typeahead({
        source: function (query, process) {
            editVM.$http.post(getUrl("brand/getBrandsByName"), {keyword: query}, {emulateJSON: true})
                .then(function (response) {
                    process(response.data.obj);
                });
        },
        items: 8,
        displayText: function (item) {
            return item.brandName;
        }
    }).change(function () {
        var item = $(this).typeahead("getActive");
        editVM.brandId = item.brandId;
    });
}

function openDialog(obj) {
    var image = $(obj).attr("src");
    // alert(image);
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize, 500);
}

$(function () {
        /*var ue = UE.getEditor('editor', {
            toolbars: [
                ['undo', 'redo', 'bold', 'simpleupload']
            ],
            autoHeightEnabled: false,
            autoFloatEnabled: false,
            'enterTag': 'br'
        });*/
        UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
        UE.Editor.prototype.getActionUrl = function (action) {
            if (action == 'uploadimage' || action == 'uploadscrawl') {
                return getUrl("/fastdfs/imgUpload"); //在这里返回我们实际的上传图片地址
            } else {
                return this._bkGetActionUrl.call(this, action);
            }
        };
        $("#txtDeadline").click(function () {
            WdatePicker();
        });
        // setTimeout(setTypeAhead, 100);
        var id = $("#hidCaseId").val();
        if (id != null && id.length > 0) {
            editVM.bindCase(id);
        }
        $(".editClose").click(clearCaseId);
    }
);