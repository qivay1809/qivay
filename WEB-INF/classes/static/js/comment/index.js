/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#commentIndex',
    data: {
        search: {content: '', status: -1, beginDate: '', endDate: '',commentShow: -1,commentType: -1,inputType: -1},
        comments: [],
        beginIndex: 0,
        url: getUrl('comment/getComments')
    },
    methods: {
        getComments: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
                app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
                app.search.endDate = endDate;
            var params = {
                content: this.search.content
                ,
                status: this.search.status,
                commentShow: this.search.commentShow,
                commentType: this.search.commentType,
                inputType: this.search.inputType,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.comments = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                    this.beginIndex = (params.pageIndex - 1) * params.pageSize;
                })
        }

    }
});

function setCommentId(id) {
    $('#hidCommentId').val(id);
}

function clearCommentId() {
    $("#hidCommentId").val('');
}

function setCommentShow(id,commentShow) {
    $.confirm({
        title: '显示设置',
        content: '<h4>您确定要改变显示设置吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.$http.post(getUrl('comment/setCommentShow'),{commentId: id,commentShow: commentShow}, {emulateJSON: true})
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
    app.getComments();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearCommentId();
});
