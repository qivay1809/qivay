/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#examinationIndex',
    data: {
        search: {productName: '', brandName: '',status: -1,name:''},
        examinations: [],
        beginIndex: 0,
        url: getUrl('examination/getExaminations')
    },
    methods: {
        getExaminations: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
                app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
                app.search.endDate = endDate;
            var params = {
                productName: this.search.productName,
                brandName: this.search.brandName,
                status: this.search.status,
                name:this.search.name,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.examinations = response.data.obj.rows;
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                    this.beginIndex = (params.pageIndex - 1) * params.pageSize;
                })
        }

    }
});

function setExaminationId(id) {
    $('#hidExaminationId').val(id);
}

function clearExaminationId() {
    $("#hidExaminationId").val('');
}

$(function () {
    app.getExaminations();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearExaminationId();
});
