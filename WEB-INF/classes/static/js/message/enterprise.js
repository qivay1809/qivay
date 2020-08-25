/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editMessage',
    data: {
        messageContent: '',
        messageType: '',
        noticeTitle: '',
        receiverType: 1,
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
                    alert("请添加接收企业!");
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
    var enterpriseId = hidUser.attr("data");
    var enterpriseName = hidUser.val();
    var msg = '<a href="#" class="userMsg"><span class="badge" data="' + enterpriseId + '">' + enterpriseName + '</span>&times;</a>';
    $("#panelUsers").append(msg);
    hidUser.val("");
    hidUser.attr("data", "");
    $("#textSearch").val("");
    $(".userMsg").click(function () {
        $(this).remove();
    });
}

$(function () {
        $('#textSearch').typeahead({
            source: function (query, process) {
                editVM.$http.post(getUrl("enterprise/getEnterpriseByName"), {keyword: query}, {emulateJSON: true})
                    .then(function (response) {
                        process(response.data.obj);
                    });
            },
            items: 8,
            displayText: function (item) {
                return item.enterpriseName;
            }
        }).change(function () {
            var item = $(this).typeahead("getActive");
            $("#hidUser").attr("data", item.enterpriseId);
            $("#hidUser").val(item.enterpriseName);
        });
    }
);