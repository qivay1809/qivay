/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#identifyIndex',
    data: {
        search: {title: '',description:'', creator: '', beginDate: '', endDate: '',identifyShow:-1},
        identifies: [],
        url: getUrl('identify/getIdentifies')
    },
    methods: {
        getIdentifies: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                title: this.search.title,
                description: this.search.description,
                creator: this.search.creator,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                identifyShow: this.search.identifyShow,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.identifies = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }

    }
});

function setIdentifyId(identifyId) {
    $('#hidIdentifyId').val(identifyId);
}

function clearIdentifyId() {
    $("#hidIdentifyId").val('');
}


$(function () {
    app.getIdentifies();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearIdentifyId();
});
