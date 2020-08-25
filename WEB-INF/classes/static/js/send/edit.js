/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editMessage',
    data: {
        clueIds: [],
        receivers: [],
        url: getUrl('email/sendEmails')
    },
    methods: {
        editMessage: function () {
            $(".badge").each(function () {
                editVM.receivers.push($(this).attr("data"));
            });
            if (this.receivers.length < 1) {
                alert("请添加接收人!");
                return;
            }
            var sendType = $('#sendType').val();
            if (sendType == 'single'){
                this.clueIds.push($("#hidClueId").val());
            }else {
                $('td input[type=checkbox]:checked').each(function () {
                    editVM.clueIds.push($(this).val());
                });
            }
            var message = {
                clueIds: JSON.stringify(this.clueIds)
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
    $("#textNameSearch").val("");
    $(".userMsg").click(function () {
        $(this).remove();
    });
}

$(function () {
        $('#textSearch').typeahead({
            source: function (query, process) {
                editVM.$http.post(getUrl("email/getEmailsByEmail"), {keyword: query}, {emulateJSON: true})
                    .then(function (response) {
                        process(response.data.obj);
                    });
            },
            items: 8,
            minLength:3,
            displayText: function (item) {
                return item.emailAddress + '(' + item.emailName + ')';
            }
        }).change(function () {
            var item = $(this).typeahead("getActive");
            $("#hidUser").attr("data", item.emailId);
            $("#hidUser").val(item.emailAddress + '(' + item.emailName + ')');
        });
    $('#textNameSearch').typeahead({
        source: function (query, process) {
            editVM.$http.post(getUrl("email/getEmailsByName"), {keyword: query}, {emulateJSON: true})
                .then(function (response) {
                    process(response.data.obj);
                });
        },
        items: 8,
        displayText: function (item) {
            return item.emailAddress + '(' + item.emailName + ')';
        }
    }).change(function () {
        var item = $(this).typeahead("getActive");
        $("#hidUser").attr("data", item.emailId);
        $("#hidUser").val(item.emailAddress + '(' + item.emailName + ')');
    });
    }
);