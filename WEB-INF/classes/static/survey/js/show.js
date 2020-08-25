/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#showSurvey',
    data:{
        name:'',
        phone:'',
        categoryDisplay:'',
        address:'',
        typeDisplay:'',
        describe:'',
        purpose:'',
        remark:'',
        validate:'',
        surveyId:'',
        cause:''//验证不通过原因
    },
    methods: {
        bindfindSurveyId: function (surveyId) {
            this.$http.post(getUrl('survey/findById'), {surveyId: surveyId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var survey = response.data.obj;
                        this.name = survey.name;
                        this.phone = survey.phone;
                        this.categoryDisplay = survey.categoryDisplay;
                        this.typeDisplay = survey.typeDisplay;
                        this.address = survey.city + survey.street;

                        this.surveyId = survey.surveyId;
                        this.purpose = survey.purpose;
                        this.describe = survey.describe;
                        this.remark = survey.remark;

                        this.validate = survey.validate;
                    }
                    else alert('服务器内部错误');
                })
        },
        verifySurvey: function (obj) {
            var msg = $(obj).data("msg");
            if (msg === 2) {
                if (!confirm("请确认本次操作：验证不通过！")) return;
            }
            var data = {surveyId: this.surveyId, validate: msg, cause: this.cause};
            this.$http.post(getUrl("survey/updateValidate"), data, {emulateJSON: true})
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
    }
});

$(function () {
        var id = $("#hidSurveyId").val();
        if (id != null && id.length > 0) {
            editVM.bindfindSurveyId(id);
        }
        $(".editClose").click(clearSurveyId);
    }
);