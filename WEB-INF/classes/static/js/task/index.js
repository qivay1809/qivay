/**
 * Created by Administrator on 2017/11/17.
 */
var app = new Vue({
    el: '#taskIndex',
    data: {
        search: {taskTitle: '', taskContent: '', userName: '', progress: -1, taskType: -1, taskVerify: -1, beginDate: '', endDate: ''},
        tasks: [],
        params: [],
        beginIndex: 0,
        url: getUrl('task/getTasks'),
        exportUrl: getUrl("task/exportExcel")
    },
    methods: {
        getTasks: function (msg) {
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
                taskTitle: this.search.taskTitle
                ,
                taskContent: this.search.taskContent,
                userName: this.search.userName,
                taskVerify: this.search.taskVerify
                ,
                progress: this.search.progress,
                taskType: this.search.taskType,
                beginDate: this.search.beginDate,
                endDate: this.search.endDate,
                pageIndex: pageIndex,
                pageSize: pageSize
            };
            this.params = params;
            this.$http.post(this.url, params, {emulateJSON: true})
                .then(function (response) {
                    this.tasks = response.data.obj.rows;
                    $("#txtBeginDate").val(app.search.beginDate);
                    $("#txtEndDate").val(app.search.endDate);
                    pageVM.pages = Math.ceil(response.data.obj.total / params.pageSize);
                    this.beginIndex = (pageIndex - 1) * pageSize;
                    this.exportUrl = getUrl("task/exportExcel") + "?" + getExportExcelParams(this.params);
                    getChildesCount();
                })
        }

    }
});

function openClue(id) {
    parent.openClueTab(id);
}

function setTaskId(taskId) {
    $('#hidTaskId').val(taskId);
}

function clearTaskId() {
    $("#hidTaskId").val('');
}

function closeTaskDialog() {
    $("#hidStartTaskId").val('');
    $("#hidStartTaskProgress").val('');
    $("#startTask").modal('hide');
}

function showTaskDialog(data) {
    $("#startTask").modal('show');
    $("#hidStartTaskId").val($(data).attr("id"));
    $("#hidStartTaskProgress").val($(data).data("progress"));
}

function startTask() {
    var taskId = $("#hidStartTaskId").val();
    var progress = $("#hidStartTaskProgress").val();
    app.$http.post(getUrl("task/startTask"), {taskId: taskId, progress: progress}, {emulateJSON: true})
        .then(function (response) {
            if (response.data.code === 200) {
                alert("任务成功开始!");
                closeTaskDialog();
                $('#btnSearch').click();
                $('#btnClose').click();
            } else if (response.data.code === 403) {
                alert(response.data.msg);
            }
            else alert('服务器内部错误');
        })
}

$(function () {
        clearTaskId();
        app.getTasks();
        $("#txtBeginDate,#txtEndDate").click(function () {
            WdatePicker();
        });
    }
);

function del(taskId) {
    if (confirm("删除后不可恢复，确定要删除吗？")) {
        $.ajax({
            url: "/task/delete", //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            data: {
                "taskId": taskId
            }, //参数值
            type: "POST", //请求方式
            success: function () {
                $('#txtSearch').click();
            },
            error: function (res) {
                alert(res);
            }
        });
    }
}