/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#lawyerIndex',
    data: {
        search: {lawyerName: '', creator: '', beginDate: '', endDate: '',lawyerShow: -1,lawyerType: -1,enName:'',lawFirm: '',minWorkYear: null,maxWorkYear: null},
        beginIndex:0,
        lawyers: [],
        url: getUrl('lawyer/getLawyers')
    },
    methods: {
        getLawyers: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                lawyerName: this.search.lawyerName,
                creator: this.search.creator,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                lawyerShow: this.search.lawyerShow,
                lawyerType: this.search.lawyerType,
                enName: this.search.enName,
                lawFirm: this.search.lawFirm,
                minWorkYear: this.search.minWorkYear,
                maxWorkYear: this.search.maxWorkYear,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.lawyers = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }

    }
});

function setLawyerId(lawyerId) {
    $('#hidLawyerId').val(lawyerId);
}

function clearLawyerId() {
    $("#hidLawyerId").val('');
}


$(function () {
    app.getLawyers();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearLawyerId();
});
