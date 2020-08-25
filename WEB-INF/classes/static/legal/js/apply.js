/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#legalApplyIndex',
    data: {
        beginIndex:0,
        search: {name: '', phone: '',legalId:''},
        legalApplys: [],
        url: getUrl('legalApply/findLegals')
    },
    methods: {
        getLegalApplys: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                phone: this.search.phone,
                legalId: request("id"),
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.legalApplys = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});


function setLegalApplyId(legalApplyId) {
    $('#hidLegalApplyId').val(legalApplyId);
}

function clearLegalApplyId() {
    $("#hidLegalApplyId").val('');
}

$(function () {
    app.getLegalApplys();
    clearLegalApplyId();
});
