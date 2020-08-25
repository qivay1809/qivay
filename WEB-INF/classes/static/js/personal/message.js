/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#messageIndex',
    data: {
        search: {userId: '', messageContent: '', messageType: '', beginDate: '', endDate: '', creator: ''},
        messages: [],
        url: getUrl('message/getMessagesByUser')
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
            app.search.userId = $("#hidMessageId").val();
            var params = {
                userId: this.search.userId,
                messageContent: this.search.messageContent
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


function getCurrentUserId() {
    app.$http.post(getUrl('user/currentUser'), {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                var user = response.data.obj;
                if (user) {
                    setMessageId(user.userId);
                } else {
                    window.location.href = getUrl("login.html");
                }
                app.getMessages();
            }
            else alert('服务器内部错误');
        })
}

$(function () {
        getCurrentUserId();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);