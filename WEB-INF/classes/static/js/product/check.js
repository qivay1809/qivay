/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editProduct',
    data: {
        productId: '',
        productName: '',
        productEnname: '',
        brand: '',
        productImageFront: '',
        productImageFrontDisplay: '',
        productImageBack: '',
        productImageBackDisplay: '',
        productVerify: -1,
        productVerifyDisplay: '',
        content: '',
        url: getUrl('product/auditProduct')
    },
    methods: {
        bindProduct: function (id) {
            this.$http.post(getUrl('product/getProduct'), {productId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var product = response.data.obj;
                        this.productId = product.productId;
                        this.productName = product.productName;
                        this.productEnname = product.productEnname;
                        this.brand = product.brandName;
                        this.productImageFront = product.productImageFront;
                        this.productImageFrontDisplay = product.productImageFrontDisplay;
                        this.productImageBack = product.productImageBack;
                        this.productImageBackDisplay = product.productImageBackDisplay;
                        this.productVerify = product.productVerify;
                        this.productVerifyDisplay = product.productVerifyDisplay;
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
    setTimeout(setOpenSize,500);
}

$(function () {
        var id = $("#hidProductId").val();
        editVM.bindProduct(id);
        $(".editClose").click(clearProductId);

    }
);