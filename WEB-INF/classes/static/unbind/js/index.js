/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#unbindIndex',
    data: {
        beginIndex:0,
        search: {name: '', phone: '',accountType: -1, state: -1},
        unbinds: [],
        url: getUrl('unbind/findUnbinds')
    },
    methods: {
        getUnbinds: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                phone: this.search.phone,
                state: this.search.state,
                accountType: this.search.accountType,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.unbinds = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});


function setUnbindId(unbindId) {
    $('#hidUnbindId').val(unbindId);
}

function clearUnbindId() {
    $("#hidUnbindId").val('');
}

$(function () {
    app.getUnbinds();
    clearUnbindId();
});
