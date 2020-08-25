/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#showSurveyApply',
    data:{
        name:'',
        phone:'',
        unit:'',
        address:'',
        price:'',
        plan:'',
        experience:'',
        statusDisplay:'',
        createTime:''//验证不通过原因
    },
    methods: {
        bindfindSurveyApplyId: function (surveyApplyId) {
            this.$http.post(getUrl('surveyApply/findById'), {surveyApplyId: surveyApplyId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var survey = response.data.obj;
                        this.name = survey.name;
                        this.phone = survey.phone;
                        this.unit = survey.unit;
                        this.address = survey.address;

                        this.price = survey.price;
                        this.plan = survey.plan;
                        this.experience = survey.experience;
                        this.statusDisplay = survey.statusDisplay;
                        this.createTime = survey.createTime;
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

$(function () {
        var id = $("#hidSurveyApplyId").val();
        if (id != null && id.length > 0) {
            editVM.bindfindSurveyApplyId(id);
        }
        $(".editClose").click(clearSurveyApplyId);
    }
);