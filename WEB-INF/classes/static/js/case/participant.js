var participantVM = new Vue({
    el: "#participantIndex",
    data: {
        search : {caseId:'',userName:'',cellphone:'',progress: -1, beginDate: '', endDate: '',caseTitle:''},
        participants: [],
        params: [],
        url: getUrl('case/getParticipants'),
        exportParticipantUrl: getUrl('case/exportParticipant')
    },
    methods: {
        getParticipants: function (msg) {
            if ("msg" != msg) {
                participantPageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate2").val();
            participantVM.search.beginDate = beginDate;
            var endDate = $("#txtEndDate2").val();
            participantVM.search.endDate = endDate;
            var pageIndex = participantPageVM.current_page;
            var pageSize = 10;
            var params = {
                caseId: this.search.caseId,
                caseTitle: this.search.caseTitle,
                userName: this.search.userName
                , cellphone: this.search.cellphone, progress: this.search.progress
                , beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageIndex, pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.participants = response.data.obj.rows;
                    $("#txtBeginDate2").val(participantVM.search.beginDate);
                    $("#txtEndDate2").val(participantVM.search.endDate);
                    participantPageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportParticipantUrl = getUrl("case/exportParticipant") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        },
        auditCase: function (caseParticipantId) {
            this.$http.post(getUrl("case/auditCase"), {caseParticipantId:caseParticipantId}, {emulateJSON: true})
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
        bindCaseId: function (caseId) {
            participantVM.search.caseId = caseId;
        }

    }
});

function auditCase(msg) {
        $.confirm({
            title: '财务审核',
            content: '<h4>您确定要发送财务审核吗？</h4>',
            buttons: {
                '确定': {
                    btnClass: 'btn-primary',
                    action: function () {
                        participantVM.auditCase(msg);
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

function clearCaseId() {
    $("#hidCaseId").val('');
}

$(function () {
    $("#txtBeginDate2,#txtEndDate2").click(function () {
        WdatePicker();
    });
    var id = $("#hidCaseId").val();
    if (id != null && id.length > 0) {
        participantVM.bindCaseId(id);
    }
    participantVM.getParticipants();
    $(".editClose").click(clearCaseId);
});