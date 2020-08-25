/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#questionIndex',
    data: {
        search: {userName: '', content: '', questionType: -1, questionShow: -1, questionVerify: -1, answerVerify: -1, beginDate: '', endDate: ''},
        questions: [],
        currentUser: '',
        beginIndex: 0,
        params: [],
        questionTypes: [],
        url: getUrl('question/getQuestions'),
        exportUrl: getUrl("question/exportExcel")
    },
    methods: {
        getQuestions: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                userName: this.search.userName
                ,
                content: this.search.content,
                questionType: this.search.questionType,
                questionShow: this.search.questionShow,
                answerVerify: this.search.answerVerify,
                questionVerify: this.search.questionVerify
                , beginDate: this.search.beginDate, endDate: this.search.endDate,
                pageIndex: pageIndex,
                pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.questions = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("question/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        },
        showAnswerVerify: function () {
            if (this.search.questionVerify == 1) {
                $("#selAnswerVerify").show();
            } else {
                $("#selAnswerVerify").hide();
                this.search.answerVerify = -1;
            }
        },
        setQuestionShow: function (id, result) {
            this.$http.post(getUrl('question/setQuestionShow'), {questionId: id, questionShow: result}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        getQuestionTypes: function () {
            this.$http.post(getUrl('question/getQuestionTypes'), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.questionTypes = response.data.obj;
                    }
                    else alert('服务器内部错误');
                })
        }


    }
});

function getCurrentUserId() {
    app.$http.post(getUrl('user/currentUser'), {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                var user = response.data.obj;
                if (user) {
                    app.currentUser = user.userId;
                }
            }
            else alert('服务器内部错误');
        })
}

function setQuestionShow(id, result) {
    app.setQuestionShow(id, result);
}

function setQuestionId(questionId, msg) {
    $('#hidQuestionId').val(questionId);
    $('#hidQuestionVerify').val(msg);
}
function setAnswerVerify(questionId, msg) {
    $('#hidQuestionId').val(questionId);
    $('#hidAnswerVerify').val(msg);
}

function clearQuestionId() {
    $("#hidQuestionId").val('');
    $('#hidAnswerVerify').val('');
    $('#hidQuestionVerify').val('');
}

$(function () {
        getCurrentUserId();
        clearQuestionId();
        $("#selAnswerVerify").hide();
        app.getQuestions();
        app.getQuestionTypes();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);

function del(questionId) {
    if (confirm("删除后不可恢复，确定要删除吗？")) {
        $.ajax({
            url: "/question/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "questionId": questionId
            }, //参数值
            type: "POST", //请求方式
            success: function () {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
    }
}