var suggestion = new Vue({
    el: "#suggestionIndex",
    data: {
        search: {beginDate: '',endDate: ''},
        beginIndex: 0,
        suggestions: []
    },
    methods: {
        getSuggestions: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {pageIndex: pageVM.current_page,pageSize: 10};
            this.$http.post(getUrl('suggestion/getSuggestions',params,{emulateJSON: true})).then(function (response) {
                if (response.data.code == 200){
                    suggestion.suggestions = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (params.pageIndex - 1) * params.pageSize;
                }
            });
        }
    }
});

function setSuggestionId(msg) {
    $("#hidSuggestionId").val(msg);
}

function clearSuggestionId() {
    $("#hidSuggestionId").val('');
}


$(function () {
    clearSuggestionId();
    suggestion.getSuggestions();
});