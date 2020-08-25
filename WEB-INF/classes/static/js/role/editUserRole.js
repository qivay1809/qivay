/**
 * Created by Administrator on 2017/11/17.
 */

var editVM = new Vue({
    el: '#editUserRole',
    data: {
        roleId: '',
        users: [],
        url: getUrl('role/addUserRoles')
    },
    methods: {
        editUserRole: function () {
            $(".badge").each(function () {
                editVM.users.push($(this).attr("data"));
            });
            if (this.users.length < 1) {
                alert("请添加接收人!");
                return;
            }
            this.roleId = $("#hidRoleId").val();
            var params = {
                roleId: this.roleId
                , users: JSON.stringify(this.users)
            };
            this.$http.post(this.url, params, {emulateJSON: true})
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
                if (item.cellphone){
                    return item.cellphone + "(" + item.userName + ")";
                }else {
                    return item.userName;
                }

            }
        }).change(function () {
            var item = $(this).typeahead("getActive");
            $("#hidUser").attr("data", item.userId);
            $("#hidUser").val(item.cellphone ? item.cellphone + "(" + item.userName + ")" : item.userName);
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
            if (item.userName){
                return item.cellphone + "(" + item.userName + ")";
            }else {
                return item.cellphone;
            }
        }
    }).change(function () {
        var item = $(this).typeahead("getActive");
        $("#hidUser").attr("data", item.userId);
        $("#hidUser").val(item.userName ? item.cellphone + "(" + item.userName + ")" : item.cellphone);
    });
});