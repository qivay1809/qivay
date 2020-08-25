/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editMessage',
    data: {
        messageContent: '',
        messageType: '',
        noticeTitle: '',
        receiverType: 0,
        receivers: [],
        url: getUrl('message/addMessage')
    },
    methods: {
        editMessage: function () {
            if (!this.messageType) {
                alert("请选择信息类型!");
                return;
            }
            if (!this.messageContent) {
                alert("请填写信息内容!");
                return;
            }
            var length = $('input[type=checkbox]:checked').length;
            if (length > 1) {
                alert("单选框只能选择一个!");
                return;
            }
            var type = $('input[type=checkbox]:checked').val();
            if (!type) {
                type = 0;
                $(".badge").each(function () {
                    editVM.receivers.push($(this).attr("data"));
                });
                if (this.receivers.length < 1) {
                    alert("请添加接收人!");
                    return;
                }
            }
            var message = {
                messageContent: this.messageContent
                , messageType: this.messageType,
                type: type,
                noticeTitle: this.noticeTitle,
                receiverType: this.receiverType
                , receivers: JSON.stringify(this.receivers)
            };
            this.$http.post(this.url, message, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else alert('保存失败');
                })
        }
    }
});

function addUser() {
    var hidUser = $("#hidUser");
    var userId = hidUser.attr("data");
    var userName = hidUser.val();
    var msg = '<a href="#" class="userMsg"><span class="badge" data="' + userId + '">' + userName + '</span>&times;</a>';
    $("#panelUsers").append(msg);
    hidUser.val("");
    hidUser.attr("data", "");
    $("#textSearch").val("");
    $("#textCellphoneSearch").val("");
    $(".userMsg").click(function () {
        $(this).remove();
    });
}

$(function () {
        $('#textSearch').typeahead({
            source: function (query, process) {
                editVM.$http.post(getUrl("user/getUsersByName"), {keyword: query}, {emulateJSON: true})
                    .then(function (response) {
                        process(response.data.obj);
                    });
            },
            items: 8,
            displayText: function (item) {
                return item.userName;
            }
        }).change(function () {
            var item = $(this).typeahead("getActive");
            $("#hidUser").attr("data", item.userId);
            $("#hidUser").val(item.userName);
        });
    $('#textCellphoneSearch').typeahead({
        source: function (query, process) {
            editVM.$http.post(getUrl("user/getUsersByCellphone"), {keyword: query}, {emulateJSON: true})
                .then(function (response) {
                    process(response.data.obj);
                });
        },
        items: 8,
        minLength:3,
        displayText: function (item) {
            return item.cellphone;
        }
    }).change(function () {
        var item = $(this).typeahead("getActive");
        $("#hidUser").attr("data", item.userId);
        $("#hidUser").val(item.cellphone);
    });
    }
);