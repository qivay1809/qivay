/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editBrand',
    data: {
        brandId: '',
        brandName: '',
        brandEnname: '',
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
        bindBrand: function (id) {
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
                });
        }
    }
});

function openImage(obj) {
    var image = $(obj).attr("src");
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize,500);
}

$(function () {
        var id = $("#hidBrandId").val();
        editVM.getEnterprises();
        if (id != null && id.length > 0) {
            $(".modal-backdrop").remove();
                editVM.bindBrand(id);
        }
        $(".editClose").click(clearBrandId);

    }
);