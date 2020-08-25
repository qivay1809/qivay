/**
 * Created by Administrator on 2018/12/7.
 */

var editVM = new Vue({
    el: '#team',
    data: {
        members: '',
        userIds:[]
    },
    methods: {
        save: function () {
            $(".badge").each(function () {
                var userId=$(this).attr("data");
                editVM.userIds.push(userId);
                editVM.members+=userId+",";
            });
            if (this.userIds.length < 1) {
                alert("请添加成员");
                return;
            }

            var message = {
               members: this.members.substring(0,this.members.length-1),
                caseId:$("#hidCaseId").val()
            };
            this.$http.post(getUrl('case/addMembers'), message, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        $('#btnClose').click();
                    }
                    else if (response.data.code === 310) {
                        alert(response.data.msg);
                    }
                    else alert('保存失败');
                })
        },
        bindMembers:function () {
            this.$http.post(getUrl('enterprise/getMembers'), { caseId:$("#hidCaseId").val() }, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var members = response.data.obj;
                        if(members!=null && members.length>0){
                            for(var i=0;i<members.length;i++){
                                appendUser(members[i].userId,members[i].showName);
                            }
                        }
                    }
                    else alert('获取成员失败');
                })
        }
    }
});

function addUser() {
    var hidUser = $("#hidUser");
    var userId = hidUser.attr("data");
    var userName = hidUser.val();
    // var msg = '<a href="#" class="userMsg"><span class="badge" data="' + userId + '">' + userName + '</span>&times;</a>';
    // $("#panelUsers").append(msg);
    // $(".userMsg").click(function () {
    //     $(this).remove();
    // });
    appendUser(userId,userName);
    hidUser.val("");
    hidUser.attr("data", "");
    $("#textSearch").val("");
    $("#textNameSearch").val("");

}

function appendUser(userId,userName) {
    var msg = '<a href="#" class="userMsg"><span class="badge" data="' + userId + '">' + userName + '</span>&times;</a>';
    $("#panelUsers").append(msg);
    $(".userMsg").click(function () {
        $(this).remove();
    });
}

$(function () {
        $('#textSearch').typeahead({
            source: function (query, process) {
                editVM.$http.post(getUrl("enterprise/getEnterpriseUser"), {keyword: query}, {emulateJSON: true})
                    .then(function (response) {
                        process(response.data.obj);
                    });
            },
            items: 8,
            minLength:2,
            displayText: function (item) {
                return item.showName;
            }
        }).change(function () {
            var item = $(this).typeahead("getActive");
            $("#hidUser").attr("data", item.userId);
            $("#hidUser").val(item.showName);
        });

        editVM.bindMembers();

    }
);
