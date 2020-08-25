/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editNews',
    data: {
        newsId: '',
        newsTitle: '',
        newsImage: '',
        newsImageCompress: '',
        file: '',
        newsContent: '',
        newsDesc: '',
        newsOrder: '',
        newsShow: 0,
        newsType: 0,
        url: getUrl('news/addNews'),
        uploadUrl: getUrl("fastdfs/uploadImages")
    },
    methods: {
        editNews: function () {
            if (!this.newsTitle) {
                alert("请填写新闻标题!");
                return;
            }
            if (!this.newsDesc) {
                alert("请填写新闻简介!");
                return;
            }
            if (this.file) {
                this.newsImage = this.file;
            }
            if (!this.newsImage) {
                alert("请上传新闻图片!");
                return;
            }
            this.newsContent = UE.getEditor('editor').getContent();
            if (!this.newsContent) {
                alert("请填写新闻内容!");
                return;
            }
            if (!this.newsOrder) {
                alert("请填写新闻排序!");
                return;
            }
            var news = {
                newsTitle: this.newsTitle
                , newsImage: this.newsImage
                , newsContent: this.newsContent
                , newsOrder: this.newsOrder
                , newsDesc: this.newsDesc
                , newsShow: this.newsShow
                , newsType: this.newsType
                , newsId: this.newsId
            };
            if (this.newsId) {
                this.url = getUrl("news/updateNews");
            }
            this.$http.post(this.url, news, {emulateJSON: true})
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
        bindNews: function (id) {
            this.$http.post(getUrl('news/getNews'), {newsId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var news = response.data.obj;
                        this.newsId = news.newsId;
                        this.newsTitle = news.newsTitle;
                        this.newsImage = news.newsImage;
                        this.newsImageCompress = news.newsImageCompress;
                        this.newsOrder = news.newsOrder;
                        this.newsContent = news.newsContent;
                        this.newsDesc = news.newsDesc;
                        this.newsShow = news.newsShow;
                        this.newsType = news.newsType;
                        setTimeout(function () {
                            UE.getEditor('editor').setContent(editVM.newsContent);
                        },100);
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var ue = UE.getEditor('editor', {
            toolbars: [
                ['undo', 'redo', 'bold','simpleupload']
            ],
            autoHeightEnabled: false,
            autoFloatEnabled: false,
            'enterTag': 'br'
        });
        UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
        UE.Editor.prototype.getActionUrl = function(action) {
            if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
                return getUrl("/fastdfs/imgUpload"); //在这里返回我们实际的上传图片地址
            } else {
                return this._bkGetActionUrl.call(this, action);
            }
        };
        var id = $("#hidNewsId").val();
        if (id != null && id.length > 0) {
            editVM.bindNews(id);
        }
        $(".editClose").click(clearNewsId);
    }
);