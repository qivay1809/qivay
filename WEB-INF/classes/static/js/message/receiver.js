/**
 * Created by Administrator on 2017/11/17.
 */
var receiverVM = new Vue({
    el: '#receiver',
    data: {
        search: {messageId: ''},
        receivers: [],
        receiverType: 1,
        url: getUrl('message/getReceivers')
    },
    methods: {
        getReceivers: function () {
            var params = {
                messageId: this.search.messageId
                , pageIndex: pageVM.current_page, pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.receivers = response.data.obj;
                    if (this.receivers.length < 1) {
                        this.$http.post(getUrl('message/getEnterpriseReceivers'), params, {emulateJSON: true})
                            .then(function (response) {
                                this.receivers = response.data.obj;
                                this.receiverType = 2;
                            })
                    }
                })
        }

    }
});


$(function () {
        var id = $("#hidMessageId").val();
        receiverVM.search.messageId = id;
        receiverVM.getReceivers();
    }
);