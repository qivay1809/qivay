/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#lawyerIndex',
    data: {
        search: {name: '', cellphone: '', contract: -1,certificateId: '', beginDate: '', endDate: '',attribution:''},
        lawyers: [],
        beginIndex: 0,
        params: [],
        url: getUrl('user/getLawyers'),
        exportUrl: getUrl("user/exportLawyerExcel")
    },
    methods: {
        getLawyers: function (msg) {
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
                name: this.search.name,
                attribution: this.search.attribution
                , cellphone: this.search.cellphone, certificateId: this.search.certificateId, contract: this.search.contract,  beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageIndex, pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        this.lawyers = response.data.obj.rows;
                        $("#txtBeginDate").val(app.search.beginDate);
                        $("#txtEndDate").val(app.search.endDate);
                        pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);//要进行取整处理
                        this.beginIndex = (pageIndex - 1) * pageSize;
                        this.exportUrl = getUrl("user/exportLawyerExcel") + "?" + getExportExcelParams(this.params);
                        getChildesCount();
                    }
                    else alert(response.data.msg);
                })
        },
        lawyerContract:function (userId) {
            this.$http.post(getUrl('user/lawyerContract'), {userId:userId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                    }else if (response.data.code === 403){
                        alert(response.data.msg);
                        $('#txtSearch').click();
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

function lawyerContract(userId) {
        $.confirm({
            title: '律师签约',
            content: '<h4>您确定要与该律师签约吗？</h4>',
            buttons: {
                '确定': {
                    btnClass: 'btn-primary',
                    action: function () {
                        app.lawyerContract(userId);
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


$(function () {
        app.getLawyers();
        clearUserId();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);