/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#messageIndex',
    data: {
        search: {messageContent: '', messageType: '', beginDate: '', endDate: '', creator: '',objectId:''},
        messages: [],
        url: getUrl('message/getMessages')
    },
    methods: {
        getMessages: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var params = {
                messageContent: this.search.messageContent,
                objectId: this.search.objectId
                , messageType: this.search.messageType, beginDate: this.search.beginDate
                , endDate: this.search.endDate, creator: this.search.creator, pageIndex: pageVM.current_page, pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.messages = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                })
        }

    }
});

function setMessageId(messageId) {
    $('#hidMessageId').val(messageId);
}

function clearMessageId() {
    $("#hidMessageId").val('');
}

$(function () {
        app.getMessages();
        clearMessageId();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);