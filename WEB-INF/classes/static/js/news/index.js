/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#newsIndex',
    data: {
        search: {newsTitle: '', creator: '', beginDate: '', endDate: '',newsShow:-1,newsType: -1},
        beginIndex: 0,
        newses: [],
        url: getUrl('news/getNewses')
    },
    methods: {
        getNewses: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
                app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
                app.search.endDate = endDate;
            var params = {
                newsTitle: this.search.newsTitle
                ,
                creator: this.search.creator,
                newsShow: this.search.newsShow,
                newsType: this.search.newsType,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.newses = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                })
        }

    }
});

function setNewsId(jobId) {
    $('#hidNewsId').val(jobId);
}

function clearNewsId() {
    $("#hidNewsId").val('');
}

$(function () {
    app.getNewses();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearNewsId();
});
