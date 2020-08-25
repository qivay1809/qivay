var app = new Vue({
    el: "#auditIndex",
    data: {
        search : {caseId:'',caseTitle:'',userName:'',cellphone:'',progress: -1, beginDate: '', endDate: ''},
        authority: 0,
        participantCases: [],
        params: [],
        url: getUrl('case/getAuditParticipants')
    },
    methods: {
        getParticipantCases: function (msg) {
            if ("msg" != msg) {
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
            app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
            app.search.endDate = endDate;
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                caseId: this.search.caseId,
                userName: this.search.userName
                , cellphone: this.search.cellphone, progress: this.search.progress
                , beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageIndex, pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.participantCases = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    getChildesCount();
                })
        },
        auditParticipantCase: function (caseParticipantId) {
            this.$http.post(getUrl("case/auditParticipantCase"), {caseParticipantId:caseParticipantId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch2').click();
                    }else if (response.data.code === 403){
                        alert(response.data.msg);
                        $('#txtSearch2').click();
                    }
                    else alert('服务器内部错误');
                })
        },
        getUserAuthority : function () {
            this.$http.post(getUrl("/user/currentUser"), {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        var user = response.data.obj;
                        this.authority = user.admin;
                    }
                    else alert('服务器内部错误');
                })
        }

    }
});

function endParticipantCase(msg) {
        $.confirm({
            title: '案件完结',
            content: '<h4>您确定要完结案件吗？</h4>',
            buttons: {
                '确定': {
                    btnClass: 'btn-primary',
                    action: function () {
                        app.auditParticipantCase(msg);
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

function setCaseId(caseId) {
    $('#hidCaseId').val(caseId);
}

function clearCaseId() {
    $('#hidCaseId').val("");
}

$(function () {
    clearCaseId();
    app.getUserAuthority();
    app.getParticipantCases();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
});