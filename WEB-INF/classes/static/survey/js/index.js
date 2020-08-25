/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#surveyIndex',
    data: {
        beginIndex:0,
        search: {name: '', phone: '',validate: -1},
        surveys: [],
        url: getUrl('survey/findSurveys')
    },
    methods: {
        getSurveys: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                phone: this.search.phone,
                validate: this.search.validate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.surveys = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});


function setSurveyId(surveyId) {
    $('#hidSurveyId').val(surveyId);
}

function clearSurveyId() {
    $("#hidSurveyId").val('');
}

$(function () {
    app.getSurveys();
    clearSurveyId();
});
