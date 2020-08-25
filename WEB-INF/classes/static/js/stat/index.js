/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#statIndex',
    data: {
        stats: [],
        url: getUrl('stat/visitStats')
    },
    methods: {
        getVisitStats: function () {
            this.$http.post(this.url, null, {emulateJSON: true})
                .then(function (response) {
                    this.stats = response.data.obj;
                })
        }

    }
});

$(function () {
        app.getVisitStats();
    }
);