/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#moneyApplyIndex',
    data: {
        beginIndex:0,
        search: {accountType: -1, validate: -1, name:'',cellphone:'',amount:''},
        moneyApplys: [],
        allAmount: 0,
        total:0,
        url: getUrl('moneyApply/getMoneyApplys')
        //exportUrl: getUrl('money/exportExcel')
    },
    methods: {
        getMoneyApplys: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                accountType: this.search.accountType,
                validate: this.search.validate,
                name: this.search.name,
                cellphone: this.search.cellphone,
                amount: this.search.amount,
                pageIndex: pageVM.current_page,
                pageSize: 15
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    var allAmountStr = response.data.msg;
                    this.allAmount = Math.round(allAmountStr * 100) / 100;
                    this.total = response.data.obj.total;
                    this.moneyApplys = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    //this.exportUrl = getUrl("money/exportExcel") + "?" + getExportExcelParams(this.params);
                })
        }

    }
});


function setApplyId(applyId) {
    $('#hidApplyId').val(applyId);
}

function clearApplyId() {
    $("#hidApplyId").val('');
}



$(function () {
    app.getMoneyApplys();
    /*if (id != null && id.length > 0) {
        editVM.bindNews(id);
    }*/
    clearApplyId();
});
