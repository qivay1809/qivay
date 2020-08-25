/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#examinationIndex',
    data: {
        search: {productName: '', brandName: '', beginDate: '', endDate: '',minAmount:null,maxAmount: null,address: '',shopType: -1,shopName: '',status: -1,name: '',company: '',sheetNo: '',hasReturn: -1},
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
                productName: this.search.productName
                ,
                brandName: this.search.brandName,
                minAmount: this.search.minAmount,
                maxAmount: this.search.maxAmount,
                address: this.search.address,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                shopType: this.search.shopType,
                shopName: this.search.shopName,
                status: this.search.status,
                name: this.search.name,
                company: this.search.company,
                hasReturn: this.search.hasReturn,
                sheetNo: this.search.sheetNo,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.examinations = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
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
