/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editImage',
    data: {
        adImageId: '',
        imageName: '',
        image: '',
        imageCompress: '',
        file: '',
        fileH5: '',
        //html: '',
        adOrder: '',
        adShow: 0,
        type: 1,
        newss: [],
        newsId:'',
        url: getUrl('adImage/addImage'),
        uploadUrl: getUrl("fastdfs/uploadImages")
    },
    methods: {
        editImage: function () {

            if (!this.imageName) {
                alert("请填写广告图片名!");
                return;
            }
            if (this.file) {
                this.image = this.file;
            }
            if (!this.image) {
                alert("请上传广告图片!");
                return;
            }
            if (!this.adOrder) {
                alert("请填写广告排序!");
                return;
            }
            var image = {
                adImageId: this.adImageId
                , imageName: this.imageName
                , url: this.image
                , adOrder: this.adOrder
                , adShow: this.adShow
                , type: this.type
                , html: this.newsId
            };
            if (this.adImageId) {
                this.url = getUrl("adImage/updateImage");
            }
            this.$http.post(this.url, image, {emulateJSON: true})
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
                        this.type = image.type;
                        this.newsId = image.html;
                    }
                    else alert('服务器内部错误');
                })
        },
        findAdDetail: function () {
            this.$http.post(getUrl('adImage/findAdDetail'), {emulateJSON: true})
                .then(function (response) {
                    this.newss = response.data.obj;
                })
        }
    }
});

$(function () {
        var id = $("#hidImageId").val();
        if (id != null && id.length > 0) {
            editVM.bindImage(id);
        }
        editVM.findAdDetail();
        $(".editClose").click(clearImageId());
    }
);