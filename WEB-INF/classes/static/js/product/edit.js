/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editProduct',
    data: {
        productId: '',
        productName: '',
        productEnname: '',
        brandId: '',
        productImageFront: '',
        productImageFrontDisplay: '',
        fontFile: '',
        productImageBack: '',
        productImageBackDisplay: '',
        backFile: '',
        productVerify: -1,
        productVerifyDisplay: '',
        verify: '',
        content: '',
        brands: [],
        url: getUrl('product/addProduct'),
        uploadUrl: getUrl("fastdfs/upload")
    },
    methods: {
        editProduct: function () {
            var imageFont = '';
            if (this.file != '') {
                imageFont = this.fontFile;
            } else {
                imageFont = this.productImageFront;
            }
            var imageBack = '';
            if (this.file != '') {
                imageBack = this.backFile;
            } else {
                imageBack = this.productImageBack;
            }
            var product = {
                productId: this.productId
                , productName: this.productName
                , productEnname: this.productEnname
                , brand: this.brandId
                , productImageFront: imageFont
                , productImageBack: imageBack
                , productVerify: this.productVerify
            };
            var id = $("#hidProductId").val();
            if (id != null && id.length > 0) {
                this.url = getUrl('product/updateProduct');
                product.productId = id;
            }
            this.$http.post(this.url, product, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        bindProduct: function (id) {
            this.$http.post(getUrl('product/getProduct'), {productId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var product = response.data.obj;
                        this.productId = product.productId;
                        this.productName = product.productName;
                        this.productEnname = product.productEnname;
                        this.brandId = product.brand;
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
        getBrands: function () {
            this.$http.post(getUrl('product/getBrands'), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var brands = response.data.obj;
                        this.brands = brands;

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
                            alert('验证成功');
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

$(function () {
        var id = $("#hidProductId").val();
        editVM.getBrands();
        if (id != null && id.length > 0) {
            editVM.bindProduct(id);
            var verify = $("#hidProductVerify").val();
            editVM.verify = verify;
        }
        $(".editClose").click(clearProductId);

    }
);