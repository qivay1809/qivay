/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#joinIndex',
    data: {
        beginIndex:0,
        search: {name: '', telephone: '', company: ''},
        joins: [],
        url: getUrl('join/getJoins')
    },
    methods: {
        getJoins: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                telephone: this.search.telephone,
                company: this.search.company,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.joins = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});


function setJoinId(joinId) {
    $('#hidJoinId').val(joinId);
}

function clearJoinId() {
    $("#hidJoinId").val('');
}

$(function () {
    app.getJoins();
    clearJoinId();
});
