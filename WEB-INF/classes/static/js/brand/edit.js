/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editBrand',
    data: {
        brandId: '',
        brandName: '',
        brandEnname: '',
        showTag: false,
        tags: '',
        logo: '',
        showLogo: '',
        file: '',
        enterpriseId: '',
        brandVerify: -1,
        brandVerifyDisplay: '',
        brands: [],
        verify: '',
        content: '',
        enterprises: [],
        url: getUrl('brand/addBrand'),
        uploadUrl: getUrl("fastdfs/upload")
    },
    methods: {
        editBrand: function () {
            if (!this.brandName) {
                alert("请填写品牌名!");
                return;
            }
            var image = '';
            if (this.file != '') {
                image = this.file;
            } else {
                image = this.logo;
            }
            /*if (!image) {
             alert("请上传商标!");
             return;
             }*/
            // if (!this.enterpriseId) {
            //     alert("请选择企业!");
            //     return;
            // }
            $(".badge").each(function () {
                editVM.tags += $(this).html() + ",";
            });

            var brand = {
                brandId: this.brandId
                , brandName: this.brandName
                , brandEnname: this.brandEnname
                , logo: image
                , enterpriseId: this.enterpriseId
                , brandVerify: this.brandVerify
                , tags: this.tags
            };
            var id = $("#hidBrandId").val();
            if (id != null && id.length > 0) {
                this.url = getUrl('brand/updateBrand');
                brand.brandId = id;
            }


            this.$http.post(this.url, brand, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        bindBrand: function (id) {
            if (this.showTag) {
                this.$http.post(getUrl('tag/getTags'), {parentId: id}, {emulateJSON: true})
                    .then(function (response) {
                        if (response.data.code === 200) {
                            var tags = response.data.obj;
                            if(tags!=null && tags.length>0){
                                for(var i=0;i<tags.length;i++){
                                    appendTag(tags[i].tagName);
                                }
                            }
                        }
                        else alert('获取标签失败');
                    })
            }
            this.$http.post(getUrl('brand/getBrand'), {brandId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var brand = response.data.obj;
                        this.brandId = brand.brandId;
                        this.brandName = brand.brandName;
                        this.brandEnname = brand.brandEnname;
                        this.logo = brand.logo;
                        this.showLogo = brand.showLogo;
                        this.enterpriseId = brand.enterpriseId;
                        this.brandVerify = brand.brandVerify;
                        this.brandVerifyDisplay = brand.brandVerifyDisplay;
                    }
                    else alert('服务器内部错误');
                })
        },
        getEnterprises: function () {
            this.$http.post(getUrl('brand/getAllEnterprises'), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var enterprises = response.data.obj;
                        this.enterprises = enterprises;

                    }
                    else alert('服务器内部错误');
                })
        },
        verifyBrand: function (obj) {
            var msg = $(obj).data("msg");
            var data = {brandId: this.brandId, brandVerify: msg, content: this.content};
            var value =$(obj).val();
            if(confirm("请确认该操作："+value)) {
                this.$http.post(getUrl("brand/verifyBrand"), data, {emulateJSON: true})
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
        },
        auditBrand: function (id) {
            this.$http.post(getUrl("brand/auditBrand"), {brandId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.bindBrand(id);
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

function openImage(obj) {
    var image = $(obj).attr("src");
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize, 500);
}

function addTag() {
    var tag = $("#txtTag").val();
    if (tag == null || tag == '') return;

    var tags = [];
    $(".badge").each(function () {
        tags.push($(this).html());
    });

    for (var i = 0; i < tags.length; i++){
        if (tags[i] == tag) {
            alert('标签已存在，请重新输入');
            return;
        }
    }

    // var msg = '<a href="#" class="userMsg"><span class="badge">' + tag + '</span>&times;</a>';
    // $("#panelTags").append(msg);
    appendTag(tag);
    $("#txtTag").val("");

}

function appendTag(tag) {
    var msg = '<a href="#" class="userMsg"><span class="badge">' + tag + '</span>&times;</a>';
    $("#panelTags").append(msg);
    $(".userMsg").click(function () {
        $(this).remove();
    });
}

$(function () {
        var id = $("#hidBrandId").val();
        var edit = $("#hidEdit").val();
        editVM.showTag = edit == "1";
        editVM.getEnterprises();
        if (id != null && id.length > 0) {
            $(".modal-backdrop").remove();
            editVM.verify = $("#hidBrandVerify").val();
            if (editVM.verify) {
                editVM.auditBrand(id);
            } else {
                editVM.bindBrand(id);
            }
        }
        $(".editClose").click(clearBrandId);

    }
);