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
        },
        verifyProduct: function (obj) {
            var msg = $(obj).data("msg");
            var data = {productId: this.productId, productVerify: msg, content: this.content};
            var value =$(obj).val();
            if(confirm("请确认该操作："+value)) {
                this.$http.post(getUrl("product/verifyProduct"), data, {emulateJSON: true})
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
        auditProduct: function (id) {
            this.$http.post(getUrl("product/auditProduct"), {productId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.bindProduct(id);
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
    setTimeout(setOpenSize,500);
}

$(function () {
        var id = $("#hidProductId").val();
        if (id != null && id.length > 0) {
            editVM.auditProduct(id);
        }
        $(".editClose").click(clearProductId);

    }
);