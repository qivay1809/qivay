/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editQuestion',
    data: {
        question: {
            questionId: '',
            questionTypeId: -1,
            questionContent: '',
            questionOrder: -1,
            questionWeight: -1,
            questionVerify: -1,
            questionVerifyDisplay: '',
            questionShow: 1,
            anonymous: false,
            verify: '',
            content: ''
        },
        answer: {
            answerId: '',
            answerContent: '',
            answerWeight: -1,
            answerVerify: -1,
            answerVerifyDisplay: '',
            verify: '',
            content: ''
        },
        questionTypes: [],
        url: getUrl('question/addQuestion')
    },
    methods: {
        editQuestion: function () {
            if (this.question.questionTypeId == -1) {
                alert("请选择问题类型!");
                return;
            }
            if (!this.question.questionContent) {
                alert("请输入问题内容!");
                return;
            }
            var url = this.url;
            if (this.question.verify) {
                url = getUrl('question/updateQuestion');
            }
            this.$http.post(url, this.question, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        },
        bindQuestion: function (id) {
            this.$http.post(getUrl('question/getQuestion'), {questionId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var question = response.data.obj;
                        this.question.questionId = question.questionId;
                        this.question.questionTypeId = question.questionType.questionTypeId;
                        this.question.questionContent = question.questionContent;
                        this.question.questionOrder = question.questionOrder;
                        this.question.questionWeight = question.questionWeight;
                        this.question.questionVerify = question.questionVerify;
                        this.question.questionVerifyDisplay = question.questionVerifyDisplay;
                        this.question.questionShow = question.questionShow;
                        this.question.anonymous = question.anonymous;
                        if (question.answer) {
                            this.answer.answerId = question.answer.answerId;
                            this.answer.answerContent = question.answer.answerContent;
                            this.answer.answerWeight = question.answer.answerWeight;
                            this.answer.answerVerify = question.answer.answerVerify;
                            this.answer.answerVerifyDisplay = question.answer.answerVerifyDisplay;
                        }
                        if (this.answer.answerId == '') {
                            this.answer.answerWeight = null;
                        }
                    }
                    else alert('服务器内部错误');
                })
        },
        verifyQuestion: function (obj) {
            var msg = $(obj).data("msg");
            var data = {questionId: this.question.questionId, questionVerify: msg, content: this.question.content};
            var value =$(obj).val();
            if(confirm("请确认该操作："+value)) {
                this.$http.post(getUrl("question/verifyQuestion"), data, {emulateJSON: true})
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
        editAnswer: function () {
            if (!this.answer.answerContent) {
                alert("请填写回答内容!");
                return;
            }
            var data = {
                answerId: this.answer.answerId,
                answerContent: this.answer.answerContent,
                answerWeight: this.answer.answerWeight,
                questionId: this.question.questionId,
                answerVerify: this.answer.answerVerify
            };
            var url = getUrl("question/answerQuestion");
            if (this.answer.answerId) {
                url = getUrl("question/updateAnswer");
            }
            this.$http.post(url, data, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnAnswerClose').click();
                    }
                    else alert('保存失败');
                })
        },
        verifyAnswer: function (obj) {
            var msg = $(obj).data("msg");
            var data = {answerId: this.answer.answerId, answerVerify: msg, content: this.answer.content};
            var value =$(obj).val();
            if(confirm("请确认该操作："+value)) {
                this.$http.post(getUrl("question/verifyAnswer"), data, {emulateJSON: true})
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

$(function () {
        editVM.getQuestionTypes();
        var id = $("#hidQuestionId").val();
        editVM.question.verify = $("#hidQuestionVerify").val();
        editVM.answer.verify = $("#hidAnswerVerify").val();
        if (id != null && id.length > 0) {
            editVM.bindQuestion(id);
        } else {
            editVM.question.questionOrder = null;
            editVM.question.questionWeight = null;
        }
        $(".editClose").click(clearQuestionId);

    }
);