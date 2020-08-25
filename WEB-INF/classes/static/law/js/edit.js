/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#showLaw',
    data:{
        describe: '',
        answer: '',
        askAnswers: []
    },
    methods: {
        bindfindByAskId: function (lawAskId) {
            this.$http.post(getUrl('lawAsk/findByAskId'), {lawAskId: lawAskId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var law = response.data.obj;
                        if(law.ask != null){
                            this.describe = law.ask.describe;
                        }
                        if(law.answer != null){
                            this.answer = law.answer.answer;
                        }
                        if(law.askAnswer.length != 0){
                            this.askAnswers = law.askAnswer;
                        }
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidLawAskId").val();
        if (id != null && id.length > 0) {
            editVM.bindfindByAskId(id);
        }
        $(".editClose").click(clearLawAskId);
    }
);