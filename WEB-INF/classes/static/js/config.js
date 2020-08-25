/**
 * Created by Administrator on 2017/11/17.
 */

var qivay = {
    domain: 'https://oa.qivay.com/'
    //domain: 'http://192.168.1.66:8001/'
};

function getUrl(action) {
    return qivay.domain + action;
}


var erp = {
    domain: 'https://api.qivay.com:8443/'
    //domain: 'http://192.168.1.66:18081/'
};
function getErpUrl(action) {
    return erp.domain + action;
}


function getYmd(){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    var day = date.getDate();
    if(day < 10){
        day = "0"+day;
    }
    return year + seperator1 + month + seperator1 + day;
}

function getPage(id, page) {
    $.ajax({
        url: page,
        type: 'get',
        dataType: 'html',
        async: false,
        error: function () {
            alert('加载' + page + '失败');
        },
        success: function (data) {
            $("#" + id).html(data);
        }
    });
}

function getPaging() {
    getPage("page", "../paging.html");
}

function getDialog(id, url) {
    getPage(id, url);
}

function getChildesCount() {
    var old = parent.$("#menuTree .open");
    var parentId = $(old[0]).children("a").data("id");
    var currentId = $(old[1]).children("a").data("id");
    var current = $(parent.$("#" + parentId));
    app.$http.post(getUrl('menu/getChildes'), {parentId: parentId}, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                this.childes = response.data.obj;
                initTree(current, this.childes,currentId);
            }
            else alert('服务器内部错误');
        });
}

//拼接html构造树形子节点
function initTree(current, data,currentId) {
    var strHtml = "";
    for (var i = 0; i < data.length; i++) {
        var arrChild = data[i];
        // var count = getChildesById(arrChild.menuId);
        if (!arrChild.menuUrl) {
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
    current.html(strHtml);
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
    $(parent.$("[data-id=" + currentId + "]")).parent().addClass("open");
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

function getExportExcelParams(result) {
    var params = "";
    $.each(result, function (n, value) {
        if (params) {
            params += "&" + n + "=" + value;
        } else {
            params += n + "=" + value;
        }
    });
    return params;
}

function request(paras) {
    var url = location.href;
    // alert('request:'+url);
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}