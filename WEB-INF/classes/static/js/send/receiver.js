/**
 * Created by Administrator on 2017/11/17.
 */
var receiverVM = new Vue({
    el: '#receiver',
    data: {
        search: {clueId: ''},
        receivers: [],
        url: getUrl('email/getReceivers')
    },
    methods: {
        getReceivers: function () {
            var params = {
                clueId: this.search.clueId
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.receivers = response.data.obj;
                })
        }

    }
});


$(function () {
        var id = $("#hidClueId").val();
        receiverVM.search.clueId = id;
        receiverVM.getReceivers();
    }
);