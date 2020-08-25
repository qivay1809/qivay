/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#weiXinQaIndex',
    data: {
        search: {question: '',answer:'', creator: '', beginDate: '', endDate: '',weiXinQaShow:-1},
        weiXinQas: [],
        url: getUrl('weiXinQa/getWeiXinQas')
    },
    methods: {
        getWeiXinQas: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                question: this.search.question,
                answer: this.search.answer,
                creator: this.search.creator,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                weiXinQaShow: this.search.weiXinQaShow,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.weiXinQas = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }

    }
});

function setWeiXinQaId(weiXinQaId) {
    $('#hidWeiXinQaId').val(weiXinQaId);
}

function clearWeiXinQaId() {
    $("#hidWeiXinQaId").val('');
}


$(function () {
    app.getWeiXinQas();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearWeiXinQaId();
});
