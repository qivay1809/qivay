/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#logoutIndex',
    data: {
        beginIndex:0,
        search: {name: '', phone: ''},
        userLogouts: [],
        url: getUrl('user/getUserLogouts')
    },
    methods: {
        getUserLogouts: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var params = {
                name: this.search.name,
                phone:this.search.phone,
                pageIndex: pageVM.current_page,
                pageSize: 15
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.userLogouts = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }
    }
});

$(function () {
    app.getUserLogouts();
});
