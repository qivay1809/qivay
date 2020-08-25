var editVM = new Vue({
    el: "#editAdImage",
    data: {
        url: getUrl("/config/getAdImage"),
        uploadUrl: getUrl("/fastdfs/upload"),
        configId: '',
        imageWidth: 100,
        configKey: '',
        file: '',
        configContent: ''
    },
    methods: {
        bindImage: function () {
            this.$http.post(this.url, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var result = response.data.obj;
                        this.configContent = result.configContent;
                        this.configId = result.configId;
                        this.configKey = result.configKey;
                        setTimeout(setImageSize,50);
                    }
                    else alert('服务器内部错误');
                })
        },
        updateAdImage: function () {
            if (!this.file){
                alert("请传入新图片!");
                return;
            }
            var config = {
                configId: this.configId
                , configKey: this.configKey
                , configContent: this.file
            };
            this.$http.post(getUrl("/config/updateConfig"), config, {emulateJSON: true})
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
        }
    }
});

function setImageSize() {
    var image = $("#imagePath");
    var width = image.width();
    if (width > editVM.imageWidth){
        var height = image.height();
        var currentHeight = editVM.imageWidth * height / width;
        image.width(editVM.imageWidth);
        image.height(currentHeight);
    }
}

$(function () {
        editVM.bindImage();
    }
);