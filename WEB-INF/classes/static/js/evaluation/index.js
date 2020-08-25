/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#evaluationIndex',
    data: {
        search: {content: '', status: -1, beginDate: '', endDate: '',anonymous:-1,minLikes: -1,maxLikes: -1},
        evaluations: [],
        beginIndex: 0,
        url: getUrl('evaluation/getEvaluations')
    },
    methods: {
        getEvaluations: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            if (!app.search.minLikes) {
                app.search.minLikes = -1;
            }
            if (!app.search.maxLikes) {
                app.search.maxLikes = -1;
            }
            var beginDate = $("#txtBeginDate").val();
                app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
                app.search.endDate = endDate;
            var params = {
                content: this.search.content
                ,
                status: this.search.status,
                minLikes: this.search.minLikes,
                maxLikes: this.search.maxLikes,
                anonymous: this.search.anonymous,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.evaluations = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    if (app.search.minLikes == -1) {
                        app.search.minLikes = null;
                    }
                    if (app.search.maxLikes == -1) {
                        app.search.maxLikes = null;
                    }
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                    this.beginIndex = (params.pageIndex - 1) * params.pageSize;
                })
        }

    }
});

function setEvaluationId(id) {
    $('#hidEvaluationId').val(id);
}

function clearEvaluationId() {
    $("#hidEvaluationId").val('');
}

function deleteEvaluation(id) {
    $.confirm({
        title: '删除',
        content: '<h4>删除后无法恢复，您确定要删除吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.$http.post(getUrl('evaluation/deleteEvaluation'),{staffId: id}, {emulateJSON: true})
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
    app.getEvaluations();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearEvaluationId();
});
