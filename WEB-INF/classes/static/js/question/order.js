/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#questionOrder',
    data: {
        questionId: '',
        questionOrder: -1,
        questionWeight: -1,
        url: getUrl('question/updateWeightAndOrder')
    },
    methods: {
        editQuestion: function () {
            this.$http.post(this.url, {
                questionId: this.questionId,
                questionOrder: this.questionOrder,
                questionWeight: this.questionWeight
            }, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#btnSearch').click();
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
                        this.questionId = question.questionId;
                        this.questionOrder = question.questionOrder;
                        this.questionWeight = question.questionWeight;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidQuestionId").val();
        if (id != null && id.length > 0) {
            editVM.bindQuestion(id);
        }
        $(".editClose").click(clearQuestionId);

    }
);