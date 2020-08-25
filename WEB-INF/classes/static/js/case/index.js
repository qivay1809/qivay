var app = new Vue({
    el: '#caseIndex',
    data: {
        search: {
            caseTitle: '',
            creator: '',
            brandName: '',
            status: -1,
            beginDate: '',
            endDate: '',
            serialNumber: '',
            product: '',
            caseType: -1
        },
        cases: [],
        beginIndex: 0,
        params: [],
        url: getUrl('case/getCases'),
        exportUrl: getUrl("case/exportExcel")
    },
    methods: {
        getCases: function (msg) {
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
                caseTitle: this.search.caseTitle,
                brandName: this.search.brandName,
                creator: this.search.creator, status: this.search.status,
                product: this.search.product, serialNumber: this.search.serialNumber, caseType: this.search.caseType,
                beginDate: this.search.beginDate, endDate: this.search.endDate, pageIndex: pageIndex, pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.cases = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("case/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        },
        startCase: function (caseId) {
            this.$http.post(getUrl("case/startCase"), {caseId: caseId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                    }
                    else alert('服务器内部错误');
                })
        },
        endCase: function (caseId) {
            this.$http.post(getUrl("case/endCase"), {caseId: caseId}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                    } else if (response.data.code === 403) {
                        alert(response.data.msg);
                        $('#txtSearch').click();
                    }
                    else alert('服务器内部错误');
                })
        },
        publish: function (id) {
            if (!confirm('确定发布？')) return;

            this.$http.post(getUrl('case/startCase'), {caseId: id}, {emulateJSON: true})
                .then(function (response) {
                    if (response.data.code === 200) {
                        $('#txtSearch').click();
                        alert('发布成功');
                    } else if(response.data.code === 202){
                        $('#txtSearch').click();
                        alert(response.data.obj);
                    }
                    else alert('服务器内部错误');
                })
        }

    }
});


function startCase(msg) {
    $.confirm({
        title: '开始案件',
        content: '<h4>您确定要开始吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.startCase(msg);
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

function endCase(caseId) {
    $.confirm({
        title: '案件完结',
        content: '<h4>您确定要完结案件吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.endCase(caseId);
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

function setRewardId(rewardId) {
    $('#hidRewardId').val(rewardId);
}

function clearRewardId() {
    $("#hidRewardId").val('');
}

function clearCaseId() {
    $("#hidCaseId").val('');
}

function setClueId(clueId) {
    $('#hidClueId').val(clueId);
}

function clearClueId() {
    $("#hidClueId").val('');
}

$(function () {
        clearCaseId();
        clearClueId();
        clearRewardId();
        app.getCases();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);

function del(caseId) {
    if (confirm("删除后不可恢复，确定要删除吗？")) {
        $.ajax({
            url: "/case/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "caseId": caseId
            }, //参数值
            type: "GET", //请求方式
            success: function (response) {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
    }
}