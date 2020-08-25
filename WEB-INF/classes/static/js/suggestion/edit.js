var edit = new Vue({
    el: "#editSuggestion",
    data: {
        suggestionId: '',
        question: '',
        answer: '',
        show: 0,
        order: null,
        isCreator: true
    },
    methods: {
        editSuggestion: function () {
            if (!this.question){
                alert("请填写问题!");
            }
            var params = {
                suggestionId: this.suggestionId,
                question: this.question,
                answer: this.answer,
                show: this.show,
                order: this.order
            };
            var url = getUrl('suggestion/insertSuggestion');
            if (this.suggestionId){
                url = getUrl('suggestion/editSuggestion')
            }
            this.$http.post(url,params,{emulateJSON: true}).then(function (response) {
                if (response.data.code == 200){
                    $('#txtSearch').click();
                    $('.close').click();
                }else {
                    alert("系统错误!");
                }
            });
        },
        getSuggestion: function (suggestionId) {
            this.$http.post(getUrl('suggestion/getSuggestion'),{suggestionId: suggestionId},{emulateJSON: true}).then(function (response) {
                if (response.data.code == 200){
                    var suggestion = response.data.obj;
                    this.suggestionId = suggestion.suggestionId;
                    this.question = suggestion.question;
                    this.answer = suggestion.answer;
                    this.show = suggestion.show;
                    this.order = suggestion.order;
                    this.isCreator = suggestion.isCreator;
                }else{
                    alert("系统错误!");
                }
            });
        }
    }
});


$(function () {
    var suggestionId = $("#hidSuggestionId").val();
    if (suggestionId){
        edit.getSuggestion(suggestionId);
    }
    $(".editClose,.close").click(clearSuggestionId);
});