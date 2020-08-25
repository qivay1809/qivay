/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#legalIndex',
    data: {
        beginIndex:0,
        search: {name: '', phone: '',validate: -1},
        validate:'',
        legals: [],
        url: getUrl('legal/findLegals')
    },
    methods: {
        getLegals: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                phone: this.search.phone,
                validate: this.search.validate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.legals = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});


function setLegalId(legalId) {
    $('#hidLegalId').val(legalId);
}

function clearLegalId() {
    $("#hidLegalId").val('');
}

$(function () {
    app.getLegals();
    clearLegalId();
});
