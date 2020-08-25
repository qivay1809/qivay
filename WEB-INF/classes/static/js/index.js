/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#menuTree',
    data: {
        userId: '',
        userName: '',
        iconCompress: '',
        icon: '',
        admin: 0,
        parents: [],
        childes: []
    },
    methods: {
        getParents: function () {
            this.$http.post(getUrl('menu/getParents'), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.parents = response.data.obj;
                    } else if (response.data.code === 403) {
                        console.log(response.data.msg);
                    }
                    else alert('服务器内部错误');
                })
        }
    }
});

var user = new Vue({
    el: '#userMsg',
    data: {
        userId: '',
        userName: '',
        iconCompress: '',
        icon: ''
    },
    methods: {
        getIcon: function () {
            var icon = 'image/user.png';
            if (this.iconCompress) {
                icon = this.iconCompress;
            } else if (this.icon) {
                icon = this.icon;
            }

        }
    }
});


function getCurrentUserId() {
    app.$http.post(getUrl('user/currentUser'), {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                var data = response.data.obj;
                if (data) {
                    user.userId = data.userId;
                    user.userName = data.name;
                    user.iconCompress = data.iconCompress;
                    user.iconCompress = data.icon;
                    app.admin = data.admin;
                    var image = $("#userIcon");
                    var icon = 'image/user.png';
                    if (user.iconCompress) {
                        icon = user.iconCompress;
                    } else if (user.icon) {
                        icon = user.icon;
                    }
                    image.attr('src', icon);
                    app.getParents();
                    var _beforeUnload_time = 0, _gap_time = 0;
                    var is_fireFox = navigator.userAgent.indexOf("Firefox") > -1;//是否是火狐浏览器
                    window.onunload = function () {
                        _gap_time = new Date().getTime() - _beforeUnload_time;
                        if (_gap_time <= 5) {
                            $.post(getUrl('user/logout'), {emulateJSON: true}, "json");
                        }
                    };
                    window.onbeforeunload = function () {
                        _beforeUnload_time = new Date().getTime();
                        if (is_fireFox) {
                            $.post(getUrl('user/logout'), {emulateJSON: true}, "json");
                        }
                    };
                    setTimeout(setAmount, 50);
                } else {
                    window.location.href = getUrl("login.html");
                }
            }
            else alert('服务器内部错误');
        })
}

function setAmount() {
    if (app.admin > 0) {
        $("#company").show();
        getAmount();
        setInterval(getAmount, 1000 * 60);
        //getTax();
        //setInterval(getTax, 1000 * 60);
    }
}

function getAmount() {
    app.$http.post(getUrl('enterprise/getCompanyAmount'), {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                $("#companyAmount").html(response.data.obj);
            } else if (response.data.code === 403) {
                alert(response.data.msg);
            } else {
                alert('服务器内部错误');
            }
        });
}

/*function getTax() {
    app.$http.post(getUrl('reward/countNotTax'), {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                $("#companyTax").html(response.data.obj);
            } else {
                alert('服务器内部错误');
            }
        });
}*/


function getChildes(data) {
    var parentId = $(data).data("id");
    var current = $("#" + parentId);
    if (current.html() == '') {
        app.$http.post(getUrl('menu/getChildes'), {parentId: parentId}, {emulateJSON: true})
            .then(function (response) {
                if (response.data.code === 200) {
                    this.childes = response.data.obj;
                    initTree(parentId, this.childes);
                }
                else alert('服务器内部错误');
            })
    }

    if (current.hasClass("show")) {
        current.removeClass("show");
        current.hide();
    } else {
        $(".parent-node > ul").removeClass("show");
        $(".open").removeClass("open");
        $(".parent-node > ul").hide();
        if (current.hasClass("third")) {
            current.parents("ul").addClass("show");
            current.parents("ul").parent().addClass("open");
        }
        current.addClass("show");
        current.parent().addClass("open");
        current.show();
    }
}

function getChildesById(id) {
    var count = -1;
    app.$http.post(getUrl('menu/getChildCount'), {parentId: id}, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                count = response.data.obj;
            }
            else alert('服务器内部错误');
        });
    return count;
}


//拼接html构造树形子节点
function initTree(id, data) {
    var strHtml = "";
    for (var i = 0; i < data.length; i++) {
        var arrChild = data[i];
        var count = getChildesById(arrChild.menuId);
        if (!arrChild.menuUrl || count > 0) {
            strHtml += '<li class="parent-node"> <a href="#" onclick="getChildes(this);" data-id="' + arrChild.menuId + '"><i class="icon-minus-sign"></i> <span class="menu-text">' + arrChild.menuName + '</span><b class="arrow icon-angle-down"></b> </a> <ul id="' + arrChild.menuId + '" class="submenu third"></ul> </li>'
        } else {
            var msg = "\'" + arrChild.menuCode + "\'" + "," + "\'" + arrChild.menuUrl + "\'" + "," + "\'" + arrChild.menuName + "\'";
            if (arrChild.count) {
                strHtml += '<li> <a href="#" onclick="openTab(' + msg + ');" data-id="' + arrChild.menuId + '"><i class="icon-minus-sign"></i><span class="menu-text ' + arrChild.menuCode + '"> ' + arrChild.menuName + '</span> ' + '<span style="color: red">&emsp;' + arrChild.count + '</span>' + ' </a> </li>';
            } else {
                strHtml += '<li> <a href="#" onclick="openTab(' + msg + ');" data-id="' + arrChild.menuId + '"><i class="icon-minus-sign"></i><span class="menu-text ' + arrChild.menuCode + '"> ' + arrChild.menuName + '</span> </a> </li>';
            }
        }
    }
    var current = $("#" + id);
    current.html(strHtml);
}

function showPasswordDialog() {
    $("#updatePassword").modal('show');
}

function closePasswordDialog() {
    $("#txtPassword").val('');
    $("#txtRepassword").val('');
    $("#updatePassword").modal('hide');
}

function logout() {
    $.confirm({
        title: '注销',
        content: '<h4>您确定要退出吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.$http.post(getUrl('user/logout'), {emulateJSON: true})
                        .then(function (response) {
                            if (response.data.code === 200) {
                                window.location.href = getUrl("login.html");
                            }
                            else alert('服务器内部错误');
                        })
                }
            },
            '取消': {
                btnClass: 'btn-default',
                action: function () {
                }
            }
        }
    });

}

function reset() {
    $.dialog({
        title: '<h4>修改密码</h4>',
        content: '<div class="modal-body"> <form class="form-horizontal"> <div class="form-group"> <label class="col-sm-4 control-label">新&ensp;密&ensp;码</label> <div class="col-sm-7"> <input type="password" class="form-control" id="txtPassword" placeholder="新密码"> </div> </div> <div class="form-group"> <label class="col-sm-4 control-label">再次输入</label> <div class="col-sm-7"> <input type="password" class="form-control" id="txtRepassword" placeholder="再次输入新密码"> </div> </div> </form> </div>' + '<div> <button type="button" class="btn btn-sm btn-primary" onclick="resetPassword()" style="margin-left: 80%"> 修改 </button>'
    });
}

function resetPassword() {
    var password = $("#txtPassword").val();
    if (!password) {
        alert("请输入密码");
        return;
    }
    if (password.length < 6 || password.length > 16) {
        alert("密码由6~16位字母或数字组成");
        return;
    }
    var rePassword = $("#txtRepassword").val();
    if (!rePassword) {
        alert("请再次输入密码");
        return;
    }
    if (password != rePassword) {
        alert("两次输入必须一致");
        return;
    }
    app.$http.post(getUrl('user/resetPassword'), {
        userId: user.userId,
        password: password,
        rePassword: rePassword
    }, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                alert("修改成功!");
                window.location.href = getUrl("login.html");
            } else if (response.data.code === 403) {
                alert(response.data.msg);
                closePasswordDialog();
            }
            else alert('服务器内部错误');
        })
}

function openClueTab(taskId) {
    $(".clueIndex").parent().click();
    var id = "'" + taskId + "'";
    var time = 300;
    if ($("#cludIndex").length > 0) {
        time = 50;
    }
    setTimeout("consoleMsg(" + id + ")", time);
}

function consoleMsg(taskId) {
    var _iframe = $(window.frames["clueIndex"].document);
    _iframe.find("#txtTaskId").val(taskId);
    _iframe.find("#hidTaskId").click();
    _iframe.find("#btnSearch").click();
}

function editBalance() {
    $("#companyAmount").hide();
    $("#txtBalance").show();
    $("#btnEdit").hide();
    $("#btnSave").show();
    $("#txtBalance").val($("#companyAmount").html());

}

function save() {
    var balance = $("#txtBalance").val();
    if (!balance) alert("请填写余额");

    app.$http.post(getUrl('enterprise/setBalance'), {balance: balance}, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                $("#companyAmount").show();
                $("#txtBalance").hide();
                $("#btnEdit").show();
                $("#btnSave").hide();
                $("#companyAmount").html(response.data.obj);
            } else {
                alert('服务器内部错误');
            }
        });
}

$(function () {
    $(".breadcrumb li").eq(2).hide();
    getCurrentUserId();
    // app.getParents();
    shows();
    window.setInterval("shows()", 1000 * 60 * 2);

    window.setTimeout("balance()",1000);//延时1秒
    window.setInterval("balance()",1000 * 60 * 3)

});


//待审核提醒
function shows() {
    $.ajax({
        url: "/menu/getChildes?parentId=bd38729f09e84e26bf55f5f013ccd4ae",
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        type: "POST", //请求方式
        success: function (res) {
            var menus = res.obj;
            var str = "";
            var x = 0;
            for (var i = 0; i < menus.length; i++) {
                var arrChild = menus[i];
                if (arrChild.count == 0 || arrChild.count == undefined) {
                    continue;
                }
                x++;
                var msg = "\'" + arrChild.menuCode + "\'" + "," + "\'" + arrChild.menuUrl + "\'" + "," + "\'" + arrChild.menuName + "\'";
                str += '<li style="list-style: none"><i class="icon-fire"></i> <a href="#" title="火速前往" onclick="openTab(' + msg + ');" data-id="' + arrChild.menuId + '"><span class="menu-text ' + arrChild.menuCode + '"> 【' + arrChild.menuName + '】</span></a>有 <span style="color: red;font-weight: bold">' + arrChild.count + '</span> 项待审核，请及时处理！ </li>';
            }
            if (x > 0) {
                $.messager.show({
                    title: '待审核提醒',
                    msg: str,
                    timeout: 10000,
                    showType: 'show',
                    width: 350,
                    height: 300
                });
            }
        }
    });
}

//余额不足提醒
function balance() {
    $.ajax({
        url: "/enterprise/countAllBalance",
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        type: "POST", //请求方式
        success: function (res) {
            if (res.code === 403) {
                $.messager.show({
                    title: '余额不足提醒',
                    msg: res.msg,
                    timeout: 10000,
                    showType: 'show',
                    width: 350,
                    height: 150
                });
            }
        }
    });
}