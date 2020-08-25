/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#staffIndex',
    data: {
        search: {staffName: '', staffShow: -1, beginDate: '', endDate: '',staffType:-1},
        staffs: [],
        beginIndex: 0,
        url: getUrl('staff/getStaffs')
    },
    methods: {
        getStaffs: function (msg) {
            if ("msg" != msg){
                pageVM.current_page = 1;
            }
            var beginDate = $("#txtBeginDate").val();
                app.search.beginDate = beginDate;
            var endDate = $("#txtEndDate").val();
                app.search.endDate = endDate;
            var params = {
                staffName: this.search.staffName
                ,
                staffShow: this.search.staffShow,
                staffType: this.search.staffType,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageVM.current_page,
                pageSize: 10
            };
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.staffs = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages=Math.ceil(response.data.obj.total/params.pageSize);
                    this.beginIndex = (params.pageIndex - 1) * params.pageSize;
                })
        }

    }
});

function setStaffId(id) {
    $('#hidStaffId').val(id);
}

function clearStaffId() {
    $("#hidStaffId").val('');
}

function deleteStaff(id) {
    $.confirm({
        title: '删除',
        content: '<h4>删除后无法恢复，您确定要删除吗？</h4>',
        buttons: {
            '确定': {
                btnClass: 'btn-primary',
                action: function () {
                    app.$http.post(getUrl('staff/deleteStaff'),{staffId: id}, {emulateJSON: true})
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
    app.getStaffs();
    $("#txtBeginDate,#txtEndDate").click(function () {
        WdatePicker();
    });
    clearStaffId();
});
