/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#caseNewIndex',
    data: {
        beginIndex: 0,
        search: {name: '', phone: '', status: -1},
        caseNews: [],
        url: getUrl('caseNew/getCaseNews')
    },
    methods: {
        getCaseNews: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.caseNews = response.data.obj.rows;
                    console.log(this.caseNews);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});

$(function () {
    app.getCaseNews();
});
