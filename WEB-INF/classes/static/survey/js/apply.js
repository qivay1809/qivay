/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#surveyApplyIndex',
    data: {
        beginIndex:0,
        search: {name: '', phone: '',surveyId:''},
        surveyApplys: [],
        url: getUrl('surveyApply/findBySurveyId')
    },
    methods: {
        getSurveyApplys: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                phone: this.search.phone,
                surveyId: request("id"),
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.surveyApplys = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});


function setSurveyApplyId(surveyApplyId) {
    $('#hidSurveyApplyId').val(surveyApplyId);
}

function clearSurveyApplyId() {
    $("#hidSurveyApplyId").val('');
}

$(function () {
    app.getSurveyApplys();
    clearSurveyApplyId();
});
