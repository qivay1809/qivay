/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#userIndexBatch',
    data: {
        arrayContent:[],
        users: [],
        beginIndex: 0,
        userState:-1,
        value:'',
        userId:'',
        url: getUrl('user/findUserBatch')
    },
    methods: {
        content_x(){
            var array = this.arrayContent;
            for(var i = 0; i < array.length; i++){
                if(array[i] != '' && array[i] != null){
                    this.value = array[i];
                }
            }
        },
        getUsers: function () {
            this.$http.post(this.url, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.users = response.data.obj;
                    }
                    else alert(response.data.msg);
                })

        },
        verifyUser: function (obj) {
            var msg = $(obj).data("msg");
            var userId = $(obj).context.id;
            console.log("userId:" +userId +"userState:"+msg+"content"+this.value);
            if (msg === 2) {
                if (!confirm("请确认本次操作：验证不通过！")) return;
            }

            var data = {userId: userId, userState: msg, content: this.value};
            this.$http.post(getUrl("user/verifyUser"), data, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        this.arrayContent = [];
                        this.value = '';
                        reload();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                    }
                    else alert('验证失败');
                    reload();
                })
        }
    }
});

function setUserId(userId) {
    $('#hidUserId').val(userId);
}

function clearUserId() {
    $("#hidUserId").val('');
}

function reload() {
    location.reload();
}

function openImage(obj) {
    var image = $(obj).attr("src");
    $("#imagePath").attr("src", image);
    $("#imageDialog").click();
    setTimeout(setOpenSize,500);
}

function allowLogin(userId) {
    var allow = confirm('是否确定允许该用户登录后台？');
    if (allow) {
        app.$http.post(getUrl('user/allowLogin'), {userId: userId}, {emulateJSON: true})
            .then(function (response) {
                // alert(response.data.msg);
                app.getUsers();
            })
    }
}

//拉黑
function pullBlack(userId) {
    $.dialog({
        title: '<h4>拉入黑名单</h4>',
        content: '<div class="modal-body"> <form class="form-horizontal"> <div class="form-group"> <label class="col-sm-2 control-label">缘由</label> <div class="col-sm-10"> <textarea rows="3" class="form-control" id="txtPullBlack"></textarea> </div> </div> </form> </div>' + '<div> <button type="button" class="btn btn-sm btn-primary" onclick="changeBlack(\''+userId+'\')" style="margin-left: 80%"> 确定 </button>'
    });
}

function changeBlack(userId) {
    var content = $("#txtPullBlack").val();
    console.log(content);
    app.$http.post(getUrl('user/pullBlack'), {userId: userId,content:content}, {emulateJSON: true})
        .then(function (response) {
            // alert(response.data.msg);
            if (response.data.code == 200){
                app.getUsers();
            }else {
                alert("服务器内部错误!");
            }
            $(".jconfirm").remove();
        })
}


function deleteUser(userId) {
    $.dialog({
        title: '<h4>注销用户</h4>',
        content: '<div class="modal-body"> <form class="form-horizontal"> <div class="form-group"> <label class="col-sm-2 control-label">缘由</label> <div class="col-sm-10"> <textarea rows="3" class="form-control" id="txtDeleteUser"></textarea> </div> </div> </form> </div>' + '<div> <button type="button" class="btn btn-sm btn-primary" onclick="changedeleteUser(\''+userId+'\')" style="margin-left: 80%"> 确定 </button>'
    });
}

function changedeleteUser(userId) {
    var content = $("#txtDeleteUser").val();
    app.$http.post(getUrl('user/deleteUser'), {userId: userId,content:content}, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code == 200){
                app.getUsers();
            }else {
                alert("服务器内部错误!");
            }
            $(".jconfirm").remove();
        })
}


function userAbnormal(userId) {
    app.$http.post(getUrl('user/userAbnormal'), {userId: userId}, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code == 200){
                app.getUsers();
            }else {
                alert("服务器内部错误!");
            }
        })
}


function resurrection(userId) {
    app.$http.post(getUrl('user/resurrection'), {userId: userId}, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code == 200){
                app.getUsers();
            }else {
                alert("服务器内部错误!");
            }
        })
}



$(function () {
        app.getUsers();
        clearUserId();
    }
);