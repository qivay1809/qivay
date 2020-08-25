/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#imageIndex',
    data: {
        search: {imageName: '',adShow: -1, type: -1},
        images: [],
        beginIndex: 0
    },
    methods: {
        getImages: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                imageName: this.search.imageName,
                adShow: this.search.adShow,
                type: this.search.type,
                pageIndex: pageIndex, pageSize: pageSize
            };
            this.$http.post(getUrl("adImage/getImages"), params, {emulateJSON: true})
                .then(function (response) {
                    this.images = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                })
        }

    }
});

function setImageId(imageId) {
    $('#hidImageId').val(imageId);
}

function clearImageId() {
    $("#hidImageId").val('');
}

function deleteImage(id) {
    $.confirm({
        title: '删除',
        content: '<h4>删除后无法恢复，您确定要删除吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.$http.post(getUrl('adImage/deleteImage'),{adImageId: id}, {emulateJSON: true})
                        .then(function (response) {
                            if (response.data.code === 200) {
                                $('#txtSearch').click();
                            }
                            else alert('服务器内部错误');
                        })
                }
            },
            '取消': {
                btnClass: 'btn-default',
                action: function () {
                }
            }
        }
    })
}

$(function () {
    clearImageId();
    app.getImages();
});