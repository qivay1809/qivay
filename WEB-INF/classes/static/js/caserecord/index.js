/**
 */
var app = new Vue({
    el: '#caseRecordIndex',
    data: {
        search: {vendorName: '', vendorCaseId:'', unileverCaseId:'', caseType: -1},
        CaseRecords: [],
        beginIndex: 0
    },
    methods: {
        getCaseRecords: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 0;
            }
            var pageIndex = pageVM.current_page;
            var pageSize = 10;
            var params = {
                vendorName: this.search.vendorName,
                vendorCaseId: this.search.vendorCaseId,
                unileverCaseId: this.search.unileverCaseId,
                caseType: this.search.caseType,
                pageIndex: pageIndex,
                pageSize: pageSize
            };
            this.$http.post(getUrl("caseRecord/getCaseRecords"), params, {emulateJSON: true})
                .then(function (response) {
                    this.CaseRecords = response.data.obj.rows;
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                })
        }

    }
});

function setImageId(imageId) {
    $('#hidImageId').val(imageId);
}

function clearImageId() {
    $("#hidImageId").val('');
}

function deleteImage(id) {
    $.confirm({
        title: '删除',
        content: '<h4>删除后无法恢复，您确定要删除吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.$http.post(getUrl('adImage/deleteImage'),{adImageId: id}, {emulateJSON: true})
                        .then(function (response) {
                            if (response.data.code === 200) {
                                $('#txtSearch').click();
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
    })
}

$(function () {
    clearImageId();
    app.getCaseRecords();
});