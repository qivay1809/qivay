/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#userIndex',
    data: {
        search: {name: '', cellphone: '', userType: -1, userState: -2, employee: -1,userId:'', beginDate: '', endDate: '',attribution:'',inviteCode:'',invitationCode:'', nowPhone:'',keyWords:''},
        users: [],
        beginIndex: 0,
        params: [],
        url: getUrl('user/getUsers'),
        exportUrl: getUrl("user/exportExcel")
    },
    methods: {
        getUsers: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var idCard = '';
            var state = this.search.userState;
            if (this.search.userState == 4) {
                state = 0;
                idCard = 'exist';
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                userName: this.search.name,
                attribution: this.search.attribution,
                inviteCode: this.search.inviteCode
                ,invitationCode:this.search.invitationCode
                ,nowPhone:this.search.nowPhone
                ,userId:this.search.userId
                ,keyWords:this.search.keyWords
                , cellphone: this.search.cellphone, idCard: idCard, userType: this.search.userType, employee: this.search.employee
                , userState: state, beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageIndex, pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.users = response.data.obj.rows;
                        $("#txtBeginDate").val(app.search.beginDate);
                        $("#txtEndDate").val(app.search.endDate);
                        pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);//要进行取整处理
                        this.beginIndex = (pageIndex - 1) * pageSize;
                        this.exportUrl = getUrl("user/exportExcel") + "?" + getExportExcelParams(this.params);
                        getChildesCount();
                    }
                    else alert(response.data.msg);
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
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);